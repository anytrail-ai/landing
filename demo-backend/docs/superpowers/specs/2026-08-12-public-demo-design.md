# public-demo (demo.anytrail.ai) — design

Public demo at **demo.anytrail.ai**. A visitor enters their name, contact email,
and company website. We Firecrawl the site with emphasis on products/services,
distill it into a structured company profile, and put a sales-agent chatbot in
front of them that sells *their* products — a live taste of Anytrail. After ~6
messages the agent closes with an Anytrail CTA ("this could be your sales agent
— book a call"). An opt-in checkbox additionally derives their ideal customer
profile and returns 5 real, Apollo-sourced leads matching it — shown on-page and
emailed to them via SES.

Linear project: https://linear.app/anytrail/project/demo-97e267f622c7
(issues ANY-112 … ANY-119 carry the per-component detail).

## Decisions

- **Stack**: same shape as the sibling repos — `web/` (Vite + React), `src/`
  (Node 20 TypeScript Lambdas, vitest), `infra` in `lib/` + `bin/` (CDK v2).
  S3 + CloudFront for the SPA, one JSON HTTP API Lambda, one response-streaming
  Lambda Function URL for chat SSE, a single DynamoDB table, Secrets Manager
  for the Firecrawl/Apollo keys. AWS profile `anytrail` (648377378513).
- **LLM**: **Bedrock** (Claude Sonnet), not Anthropic-direct. Port `runAgent` +
  `buildSystemText` from sales-agent-playground via its `bedrock.ts` runner path.
- **Extraction**: Firecrawl (net-new — neither sibling repo has it), 5–10 pages
  markdown, one Bedrock call distills to a structured profile. Cached per domain
  (TTL ~7 days). SSRF guard + outbound-fetch chokepoint ported from lead-crm.
- **Knowledge injection**: profile rendered into the system prompt behind a
  prompt-injection boundary (the `policy.ts` pattern), not as tools.
- **ICP + leads**: prospect-generator's two prompts ported to Bedrock with
  strict JSON schemas; a Bedrock call maps the ICP to Apollo search filters;
  Apollo REST returns the 5 leads. Delivered on-page and via SES.
- **Visual style**: design tokens vendored from the anytrail.ai landing
  (`web/src/index.css`) — Funnel Sans/Display, `#fefdf6` page, black buttons,
  `#2f6f4f` accent.
- **Abuse limits**: per-IP rate limit, one crawl per domain (cache), message cap
  per session (doubles as the CTA trigger), Firecrawl page cap, Bedrock token
  caps. No auth anywhere — public by design.
- **Domain**: ACM cert `c7d8217c-2d51-4dd0-99ee-1582253b6972` (us-east-1),
  DNS-validated. anytrail.ai DNS lives in **Google Cloud DNS**; validation and
  the `demo` CNAME/alias are added there.
- **Out of scope**: auth, multi-tenancy, WhatsApp, config editing UI, PDF
  briefs, contact-info enrichment beyond Apollo's response.
