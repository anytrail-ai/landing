# demo-backend

AWS backend for the live demo at [anytrail.ai/demo](https://anytrail.ai/demo)
(frontend: `../src/pages/Demo.jsx` + `demoApi.js`). Moved here from
`anytrail-ai/public-demo` so the whole demo falls under this repo's PR rules.

Visitors submit their company website; Firecrawl extracts it, Bedrock
(Claude Sonnet 4.6) distills a company profile and powers a sales-agent chat
over SSE, and the optional ICP path finds 5 real leads via Apollo, emailed via
Resend. Design/spec: `docs/superpowers/specs/2026-08-12-public-demo-design.md`.

## Stacks

- `DemoDataStack` — one DynamoDB table (leads, sessions, per-domain profile
  cache, rate buckets; TTL on `expiresAt`)
- `DemoApiStack` — public JSON HTTP API (`/demo/*`), response-streaming
  Function URL (chat/extract/prospects SSE), Secrets Manager
  (`anytrail/demo/{firecrawl,apollo,resend}`), CloudWatch cost alarms → SNS,
  Slack signup webhook (cdk.json `notifyWebhookUrl`)

## Develop / deploy

```bash
cd demo-backend
npm install
npm test
npm run synth     # cdk synth --profile anytrail
npm run deploy    # cdk deploy --all --profile anytrail
```

Kill switch: set `DEMO_OUTBOUND=disabled` on the Lambdas to stop all outbound
(Firecrawl/Apollo/Resend) without a redeploy. Rate limits and caps live in
`src/limits.ts` (currently 200 starts/network/day for testing — drop to ~20
before wide launch).
