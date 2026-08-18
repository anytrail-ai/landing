import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cwactions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as path from 'node:path';

interface ApiStackProps extends cdk.StackProps {
  table: dynamodb.Table;
}

// Two Lambdas, both public by design (no Cognito — abuse control is
// rate limiting + caps in code, see src/limits.ts):
//  - ApiFn: JSON HTTP API for /demo/* (lead capture, extraction, prospects)
//  - ChatFn: response-streaming Function URL for SSE chat
export class ApiStack extends cdk.Stack {
  readonly apiUrl: string;
  readonly chatUrl: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const firecrawlSecret = new secretsmanager.Secret(this, 'FirecrawlKey', {
      secretName: 'anytrail/demo/firecrawl',
      description: 'Firecrawl API key for demo.anytrail.ai site extraction',
    });
    const apolloSecret = new secretsmanager.Secret(this, 'ApolloKey', {
      secretName: 'anytrail/demo/apollo',
      description: 'Apollo API key for demo.anytrail.ai lead sourcing',
    });
    const resendSecret = new secretsmanager.Secret(this, 'ResendKey', {
      secretName: 'anytrail/demo/resend',
      description: 'Resend API key for demo.anytrail.ai branded email',
    });
    const slackWebhookSecret = new secretsmanager.Secret(this, 'SlackWebhook', {
      secretName: 'anytrail/demo/slack-webhook',
      description: 'Slack incoming-webhook URL for demo signup pings',
    });
    const slackBotSecret = new secretsmanager.Secret(this, 'SlackBot', {
      secretName: 'anytrail/demo/slack-bot',
      description:
        'Slack bot for threaded demo transcripts: JSON {"token":"xoxb-…","channel":"C…"}. Empty/placeholder = webhook fallback, no threads.',
    });
    const scheduleSecret = new secretsmanager.Secret(this, 'ScheduleSigningKey', {
      secretName: 'anytrail/demo/schedule-signing',
      description: 'HMAC key for scheduling manage links',
      generateSecretString: { passwordLength: 48, excludePunctuation: true },
    });

    const common = {
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(120),
      environment: {
        TABLE_NAME: props.table.tableName,
        FIRECRAWL_SECRET_ARN: firecrawlSecret.secretArn,
        APOLLO_SECRET_ARN: apolloSecret.secretArn,
        RESEND_SECRET_ARN: resendSecret.secretArn,
        EMAIL_SENDER: 'Anytrail <agent@demo.anytrail.ai>',
        // The standing video room every booking is held in (ANY-66).
        MEET_URL: 'https://meet.google.com/kzk-tpgh-sbm',
        EMAIL_TEAM_COPY: 'root@anytrail.ai',
        SLACK_WEBHOOK_SECRET_ARN: slackWebhookSecret.secretArn,
        SLACK_BOT_SECRET_ARN: slackBotSecret.secretArn,
        SCHEDULE_SECRET_ARN: scheduleSecret.secretArn,
        // Flip to 'enabled' to resume contact reveals (1 Apollo credit each).
        APOLLO_ENRICH: 'disabled',
        // Optional email fallback for signup pings; empty = Slack only.
        NOTIFY_EMAIL: '',
        // Kill switch (ANY-119): flip to 'disabled' in the console to stop all
        // outbound calls (Firecrawl/Apollo) without a redeploy.
        DEMO_OUTBOUND: 'enabled',
      },
    };

    const apiFn = new NodejsFunction(this, 'ApiFn', {
      ...common,
      entry: path.join(__dirname, '../src/api/handler.ts'),
    });

    const chatFn = new NodejsFunction(this, 'ChatFn', {
      ...common,
      entry: path.join(__dirname, '../src/chat/stream-handler.ts'),
      timeout: cdk.Duration.minutes(5),
    });

    for (const fn of [apiFn, chatFn]) {
      props.table.grantReadWriteData(fn);
      firecrawlSecret.grantRead(fn);
      apolloSecret.grantRead(fn);
      resendSecret.grantRead(fn);
      slackWebhookSecret.grantRead(fn);
      slackBotSecret.grantRead(fn);
      scheduleSecret.grantRead(fn);
      fn.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
          resources: ['*'],
        }),
      );
    }

    // Cost guardrails (ANY-119): Bedrock + Lambda invocation spikes page the
    // team via SNS email.
    const alarmTopic = new sns.Topic(this, 'AlarmTopic');
    alarmTopic.addSubscription(
      new subscriptions.EmailSubscription('root@anytrail.ai'),
    );
    const alarms = [
      new cloudwatch.Alarm(this, 'BedrockSpike', {
        metric: new cloudwatch.Metric({
          namespace: 'AWS/Bedrock',
          metricName: 'Invocations',
          statistic: 'Sum',
          period: cdk.Duration.hours(1),
        }),
        threshold: 500,
        evaluationPeriods: 1,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        alarmDescription: 'demo.anytrail.ai: >500 Bedrock invocations in an hour',
      }),
      new cloudwatch.Alarm(this, 'ApiSpike', {
        metric: apiFn.metricInvocations({ period: cdk.Duration.hours(1), statistic: 'Sum' }),
        threshold: 2000,
        evaluationPeriods: 1,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        alarmDescription: 'demo.anytrail.ai: >2000 API Lambda invocations in an hour',
      }),
    ];
    for (const alarm of alarms) alarm.addAlarmAction(new cwactions.SnsAction(alarmTopic));

    // Reminders: one rule for the whole system, not a schedule per booking, so
    // a cancelled call leaves nothing behind to clean up.
    const reminderFn = new NodejsFunction(this, 'ReminderFn', {
      ...common,
      entry: path.join(__dirname, '../src/reminders/handler.ts'),
      timeout: cdk.Duration.minutes(2),
    });
    props.table.grantReadWriteData(reminderFn);
    resendSecret.grantRead(reminderFn);
    scheduleSecret.grantRead(reminderFn);

    // This rate MUST stay equal to SWEEP_MS in src/reminders/handler.ts. The
    // handler treats a booking as due when its lead time falls inside a
    // window this wide; if the two silently drift apart (edit one without
    // the other), a gap opens between sweeps that is never sampled and some
    // bookings' T-24/T-1 reminders are skipped entirely, not just delayed.
    new events.Rule(this, 'ReminderSchedule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(15)),
      targets: [new targets.LambdaFunction(reminderFn)],
    });

    const httpApi = new apigwv2.HttpApi(this, 'DemoHttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigwv2.CorsHttpMethod.ANY],
        allowHeaders: ['content-type'],
      },
    });
    // GET+POST only — ANY would also match OPTIONS, swallowing the CORS
    // preflight before the gateway's corsPreflight config can answer it.
    httpApi.addRoutes({
      path: '/demo/{proxy+}',
      methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration('ApiIntegration', apiFn),
    });
    // Scheduling routes (ANY-66) live on the same Lambda's own if-chain
    // (src/api/handler.ts) but need their own gateway route or API Gateway
    // never invokes the Lambda for them at all — it answers 404 itself
    // before the handler ever sees the request.
    httpApi.addRoutes({
      path: '/schedule/{proxy+}',
      methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration('ScheduleIntegration', apiFn),
    });

    const chatUrl = chatFn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ['content-type'],
      },
    });

    this.apiUrl = httpApi.apiEndpoint;
    this.chatUrl = chatUrl.url;
    new cdk.CfnOutput(this, 'ApiUrl', { value: this.apiUrl });
    new cdk.CfnOutput(this, 'ChatUrl', { value: this.chatUrl });
  }
}
