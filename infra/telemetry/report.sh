#!/usr/bin/env bash
# Pulls telemetry out of DynamoDB and writes heatmap.html, a self-contained
# viewer that overlays click density on a full-page screenshot.
#
#   ./infra/telemetry/report.sh [page] [days]
#   ./infra/telemetry/report.sh home-en 30
#
# Also prints a summary: pageviews, CTA clicks by location, scroll depth.
set -euo pipefail

PROFILE="${AWS_PROFILE:-anytrail}"
REGION="${AWS_REGION:-us-east-1}"
TABLE="anytrail-web-analytics"
PAGE="${1:-home-en}"
DAYS="${2:-30}"

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
since="$(date -u -v-"${DAYS}"d +%Y-%m-%d 2>/dev/null || date -u -d "${DAYS} days ago" +%Y-%m-%d)"

echo "==> querying $TABLE for page=$PAGE since $since"

aws dynamodb query --table-name "$TABLE" \
  --profile "$PROFILE" --region "$REGION" \
  --key-condition-expression 'pk = :p AND sk >= :s' \
  --expression-attribute-values "{\":p\":{\"S\":\"evt#${PAGE}\"},\":s\":{\"S\":\"${since}\"}}" \
  --output json > /tmp/at-telemetry-raw.json

python3 "$here/report.py" /tmp/at-telemetry-raw.json "$PAGE" "$here/heatmap.html"
echo "==> wrote $here/heatmap.html"
