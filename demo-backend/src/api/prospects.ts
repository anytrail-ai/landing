import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';
import { TABLE_NAME, docClient, keys } from '../db';
import { getSecret } from '../secrets';
import { converseJson } from '../bedrock';
import { getCachedProfile } from '../pipeline/profile';
import { deriveIcp, icpToApolloFilters, type Icp } from '../pipeline/icp';
import { findContacts, orgLocation, searchOrganizations } from '../pipeline/apollo';
import { UnknownSessionError } from './extract';
import { sendProspectsEmail } from '../email';

export interface ProspectLead {
  company: string;
  website: string | null;
  location: string | null;
  employees: number | null;
  industry: string | null;
  contact: { name: string; title: string | null; linkedinUrl: string | null } | null;
  whyFit: string;
}

export interface ProspectsResult {
  icp: Icp;
  leads: ProspectLead[];
}

const whyFitSchema = z.object({ reasons: z.array(z.string()) });

// prospect-generator's hard rules, applied at the why_fit step: never pitch
// subsidiaries, competitors, or the visitor themselves.
const WHY_FIT_SYSTEM = `For each prospect company, write one specific sentence on why it fits the seller's ICP. Write exactly "SKIP" instead when the prospect is a competitor or subsidiary of the seller, OR when it does not plausibly match the ICP segments (wrong industry, consumer-only, unknown business with no evidence of fit). Only keep prospects a salesperson would actually call. Answer with JSON: {"reasons": string[]} — same order and count as the prospects given. No commentary.`;

export async function prospectsForSession(sessionId: string): Promise<ProspectsResult> {
  const lead = await docClient().send(
    new GetCommand({ TableName: TABLE_NAME, Key: keys.lead(sessionId) }),
  );
  if (!lead.Item) throw new UnknownSessionError();
  const domain = lead.Item.domain as string;
  const profile = await getCachedProfile(domain);
  if (!profile) throw new Error('not_profiled');

  const icp = await deriveIcp(profile);
  const filters = await icpToApolloFilters(icp, profile);
  const apiKey = await getSecret('APOLLO_SECRET_ARN');

  const orgs = await searchOrganizations(filters, domain, apiKey);
  // Contacts are best-effort; org list alone is still a valid result.
  const contacts = await findContacts(
    orgs.map((o) => o.id),
    icp.buyer_titles,
    apiKey,
  ).catch(() => new Map<string, never>());

  const raw = await converseJson(
    WHY_FIT_SYSTEM,
    `Seller: ${profile.companyName} — ${profile.positioning}\nICP: ${icp.icp_summary}\nProspects:\n${orgs
      .map((o, i) => `${i + 1}. ${o.name} (${o.industry ?? 'unknown industry'}, ${orgLocation(o) ?? '?'}, ~${o.estimated_num_employees ?? '?'} employees, ${o.primary_domain ?? 'no domain'})`)
      .join('\n')}`,
    2048,
  );
  const reasons = whyFitSchema.safeParse(raw).data?.reasons ?? [];

  const leads: ProspectLead[] = orgs
    .map((o, i): ProspectLead | null => {
      const why = reasons[i];
      if (why === 'SKIP') return null;
      const c = contacts.get(o.id);
      return {
        company: o.name,
        website: o.website_url ?? (o.primary_domain ? `https://${o.primary_domain}` : null),
        location: orgLocation(o),
        employees: o.estimated_num_employees,
        industry: o.industry,
        contact: c ? { name: c.name, title: c.title, linkedinUrl: c.linkedin_url } : null,
        whyFit: why ?? 'Matches the ICP segments and size.',
      };
    })
    .filter((l): l is ProspectLead => l !== null)
    .slice(0, 5);

  await docClient().send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: keys.lead(sessionId),
      UpdateExpression: 'SET icp = :icp, prospects = :p, #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':icp': icp, ':p': leads, ':s': 'prospected' },
    }),
  );
  if (leads.length) {
    await sendProspectsEmail(
      lead.Item.email as string,
      lead.Item.name as string,
      profile.companyName,
      icp,
      leads,
    );
  }
  return { icp, leads };
}
