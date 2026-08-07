#!/usr/bin/env bash
# Idempotent deploy for the first-party telemetry stack.
#
#   DynamoDB table  <- event storage, on-demand billing, TTL-expired
#   IAM role        <- least privilege: PutItem on that table only
#   Lambda + URL    <- public collector endpoint, CORS-restricted in code
#
# Safe to re-run: every step creates-or-updates. Prints the Function URL at the
# end, which is what VITE_TELEMETRY_URL must be set to.
set -euo pipefail

PROFILE="${AWS_PROFILE:-anytrail}"
REGION="${AWS_REGION:-us-east-1}"
TABLE="anytrail-web-analytics"
FUNC="anytrail-web-analytics-collector"
ROLE="anytrail-web-analytics-role"
RETENTION_DAYS="${RETENTION_DAYS:-180}"


# Ownership guard. `anytrail-telemetry` already exists in this account as an
# unrelated production service (company/campaign data, not web analytics), and
# an earlier version of this script nearly wrote into it. Every resource here is
# tagged on creation, and reused only if the tag matches -- so a name collision
# aborts instead of silently adopting someone else's table.
OWNER_TAG="anytrail-landing-web-analytics"

aws() { command aws --profile "$PROFILE" --region "$REGION" "$@"; }
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACCOUNT="$(aws sts get-caller-identity --query Account --output text)"

echo "==> account $ACCOUNT / region $REGION"

# --- DynamoDB -------------------------------------------------------------
if aws dynamodb describe-table --table-name "$TABLE" >/dev/null 2>&1; then
  arn="$(aws dynamodb describe-table --table-name "$TABLE" --query Table.TableArn --output text)"
  owner="$(aws dynamodb list-tags-of-resource --resource-arn "$arn" \
    --query "Tags[?Key=='ManagedBy'].Value | [0]" --output text 2>/dev/null || echo None)"
  if [ "$owner" != "$OWNER_TAG" ]; then
    echo "ABORT: table $TABLE exists but is not owned by this stack (ManagedBy=$owner)." >&2
    echo "       Refusing to write into a table this script did not create." >&2
    exit 1
  fi
  echo "==> table $TABLE exists (owned)"
else
  echo "==> creating table $TABLE"
  aws dynamodb create-table \
    --table-name "$TABLE" \
    --attribute-definitions AttributeName=pk,AttributeType=S AttributeName=sk,AttributeType=S \
    --key-schema AttributeName=pk,KeyType=HASH AttributeName=sk,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --tags Key=ManagedBy,Value="$OWNER_TAG" >/dev/null
  aws dynamodb wait table-exists --table-name "$TABLE"
  aws dynamodb update-time-to-live --table-name "$TABLE" \
    --time-to-live-specification "Enabled=true,AttributeName=expires" >/dev/null
  echo "==> TTL enabled (${RETENTION_DAYS}d)"
fi

# --- IAM ------------------------------------------------------------------
TRUST='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
if aws iam get-role --role-name "$ROLE" >/dev/null 2>&1; then
  owner="$(aws iam list-role-tags --role-name "$ROLE" \
    --query "Tags[?Key=='ManagedBy'].Value | [0]" --output text 2>/dev/null || echo None)"
  if [ "$owner" != "$OWNER_TAG" ]; then
    echo "ABORT: role $ROLE exists but is not owned by this stack (ManagedBy=$owner)." >&2
    echo "       Refusing to attach policies to a role this script did not create." >&2
    exit 1
  fi
  echo "==> role $ROLE exists (owned)"
else
  echo "==> creating role $ROLE"
  aws iam create-role --role-name "$ROLE" \
    --assume-role-policy-document "$TRUST" \
    --tags Key=ManagedBy,Value="$OWNER_TAG" >/dev/null
  aws iam attach-role-policy --role-name "$ROLE" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole >/dev/null
  echo "==> waiting for role propagation"
  sleep 10
fi

aws iam put-role-policy --role-name "$ROLE" --policy-name telemetry-write \
  --policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"dynamodb:PutItem\"],\"Resource\":\"arn:aws:dynamodb:${REGION}:${ACCOUNT}:table/${TABLE}\"}]}" >/dev/null

ROLE_ARN="arn:aws:iam::${ACCOUNT}:role/${ROLE}"

# --- package --------------------------------------------------------------
# The aws-sdk v3 clients used here are present in the Lambda Node 22 runtime,
# so the bundle is just the handler.
echo "==> packaging"
tmp="$(mktemp -d)"
cp "$here/index.mjs" "$tmp/"
( cd "$tmp" && zip -q -r function.zip index.mjs )

# --- Lambda ---------------------------------------------------------------
if aws lambda get-function --function-name "$FUNC" >/dev/null 2>&1; then
  echo "==> updating $FUNC"
  aws lambda update-function-code --function-name "$FUNC" \
    --zip-file "fileb://$tmp/function.zip" >/dev/null
  aws lambda wait function-updated --function-name "$FUNC"
  aws lambda update-function-configuration --function-name "$FUNC" \
    --environment "Variables={TABLE_NAME=$TABLE,RETENTION_DAYS=$RETENTION_DAYS}" >/dev/null
else
  echo "==> creating $FUNC"
  aws lambda create-function --function-name "$FUNC" \
    --runtime nodejs22.x --handler index.handler --role "$ROLE_ARN" \
    --zip-file "fileb://$tmp/function.zip" \
    --timeout 10 --memory-size 256 \
    --environment "Variables={TABLE_NAME=$TABLE,RETENTION_DAYS=$RETENTION_DAYS}" >/dev/null
  aws lambda wait function-active --function-name "$FUNC"
fi

# --- API Gateway HTTP API -------------------------------------------------
# A public Lambda Function URL returns AccessDeniedException in this account
# (blocked above the function's own config -- resource policy and AuthType=NONE
# were both correct), so the collector is fronted by an HTTP API instead.
API_NAME="anytrail-web-analytics-api"
LARN="arn:aws:lambda:${REGION}:${ACCOUNT}:function:${FUNC}"

API_ID="$(aws apigatewayv2 get-apis \
  --query "Items[?Name=='${API_NAME}'].ApiId | [0]" --output text)"

if [ "$API_ID" = "None" ] || [ -z "$API_ID" ]; then
  echo "==> creating http api"
  API_ID="$(aws apigatewayv2 create-api --name "$API_NAME" \
    --protocol-type HTTP --target "$LARN" --query ApiId --output text)"
  aws lambda add-permission --function-name "$FUNC" \
    --statement-id apigw-invoke --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT}:${API_ID}/*/*" >/dev/null
else
  echo "==> http api exists ($API_ID)"
fi

URL="$(aws apigatewayv2 get-api --api-id "$API_ID" --query ApiEndpoint --output text)"
rm -rf "$tmp"

echo
echo "==> done"
echo "VITE_TELEMETRY_URL=$URL"
