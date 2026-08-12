import { z } from 'zod';
import { converseJson } from '../bedrock';
import { LIMITS } from '../limits';
import type { CompanyProfile } from './profile';

// Ported from prospect-generator scripts/01_icp.sh — same fields, same intent,
// input is the crawled CompanyProfile instead of a CSV row.
export const icpSchema = z.object({
  icp_summary: z.string(),
  buyer_segments: z.array(z.string()),
  buyer_titles: z.array(z.string()),
  sales_motion: z.string(),
});
export type Icp = z.infer<typeof icpSchema>;

const ICP_SYSTEM = `You determine a company's ICP (ideal customer profile): who they sell to. Answer with a single JSON object:
{"icp_summary": string (1-2 sentences), "buyer_segments": string[] (industries/segments that buy), "buyer_titles": string[] (job titles of the buyers), "sales_motion": string (e.g. B2B distribution, contractor sales, retail+B2B)}
No commentary outside the JSON.`;

export async function deriveIcp(profile: CompanyProfile): Promise<Icp> {
  const raw = await converseJson(
    ICP_SYSTEM,
    `Company: ${profile.companyName}\nPositioning: ${profile.positioning}\nTarget audience: ${profile.targetAudience}\nProducts:\n${profile.products
      .map((p) => `- ${p.name}: ${p.description}`)
      .join('\n')}`,
    LIMITS.pipelineMaxTokens,
  );
  return icpSchema.parse(raw);
}

// Second small call: ICP → Apollo organization-search filters.
// Over-long arrays are clamped, not rejected — the model deciding a company
// sells to 5 countries must not kill the whole lead search.
export const apolloFiltersSchema = z.object({
  keywords: z.array(z.string()).min(1).transform((a) => a.slice(0, 5)),
  locations: z.array(z.string()).default([]).transform((a) => a.slice(0, 3)),
  employee_ranges: z.array(z.string()).default([]).transform((a) => a.slice(0, 3)),
});
export type ApolloFilters = z.infer<typeof apolloFiltersSchema>;

const FILTER_SYSTEM = `You convert an ideal-customer-profile into Apollo.io organization search filters. Answer with a single JSON object:
{"keywords": string[] (1-5 specific multi-word industry phrases as used in company descriptions, e.g. "industrial equipment distributor", "food processing plant" — never single generic words like "manufacturer"), "locations": string[] (0-3 like "Mexico" or "Texas, US"; empty if unclear), "employee_ranges": string[] (0-3 of "1,10" "11,50" "51,200" "201,500" "501,1000" "1001,5000")}
No commentary outside the JSON.`;

export async function icpToApolloFilters(icp: Icp, profile: CompanyProfile): Promise<ApolloFilters> {
  const raw = await converseJson(
    FILTER_SYSTEM,
    `ICP: ${icp.icp_summary}\nSegments: ${icp.buyer_segments.join(', ')}\nSeller: ${profile.companyName} — ${profile.positioning}`,
    1024,
  );
  return apolloFiltersSchema.parse(raw);
}
