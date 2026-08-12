import { outboundFetch } from '../net/outbound-fetch';
import type { ApolloFilters } from './icp';

const API = 'https://api.apollo.io/api/v1';

export interface ApolloOrg {
  id: string;
  organization_id?: string | null;
  name: string;
  website_url: string | null;
  primary_domain: string | null;
  city?: string | null;
  country?: string | null;
  organization_city?: string | null;
  organization_country?: string | null;
  estimated_num_employees: number | null;
  industry: string | null;
}

export function orgLocation(o: ApolloOrg): string | null {
  const city = o.city ?? o.organization_city ?? null;
  const country = o.country ?? o.organization_country ?? null;
  return [city, country].filter(Boolean).join(', ') || null;
}

export interface ApolloContact {
  name: string;
  title: string | null;
  organization_id: string | null;
  linkedin_url: string | null;
  email: string | null;
}

interface ApolloDeps {
  fetchImpl?: typeof fetch;
}

// api_search results embed the org as an object; older endpoints used a flat id.
interface PersonHit {
  id?: string;
  organization_id?: string | null;
  organization?: { id?: string } | null;
}

async function post(
  path: string,
  apiKey: string,
  body: unknown,
  fetchImpl: typeof fetch,
): Promise<unknown> {
  const res = await fetchImpl(`${API}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`apollo_${res.status}`);
  return res.json();
}

export async function searchOrganizations(
  filters: ApolloFilters,
  excludeDomain: string,
  apiKey: string,
  deps: ApolloDeps = {},
): Promise<ApolloOrg[]> {
  const fetchImpl = deps.fetchImpl ?? outboundFetch;
  const body: Record<string, unknown> = {
    q_organization_keyword_tags: filters.keywords,
    per_page: 25,
    page: 1,
  };
  if (filters.locations.length) body.organization_locations = filters.locations;
  if (filters.employee_ranges.length) {
    body.organization_num_employees_ranges = filters.employee_ranges;
  }
  const data = (await post('/mixed_companies/search', apiKey, body, fetchImpl)) as {
    organizations?: ApolloOrg[];
    accounts?: ApolloOrg[];
  };
  const orgs = [...(data.organizations ?? []), ...(data.accounts ?? [])].map(
    // accounts carry the real organization id in organization_id
    (o) => ({ ...o, id: o.organization_id ?? o.id }),
  );
  // Never recommend the visitor to themselves. Callers over-fetch and trim to
  // 5 after the why-fit filter drops non-matches.
  return orgs.filter((o) => o.primary_domain !== excludeDomain).slice(0, 12);
}

export async function findContacts(
  orgs: Array<{ id: string; domain: string | null }>,
  titles: string[],
  apiKey: string,
  deps: ApolloDeps = {},
): Promise<Map<string, ApolloContact>> {
  const fetchImpl = deps.fetchImpl ?? outboundFetch;
  if (!orgs.length) return new Map();

  const SENIORITIES = ['owner', 'founder', 'c_suite', 'partner', 'vp', 'director'];
  const search = async (body: Record<string, unknown>) =>
    (await post('/mixed_people/api_search', apiKey, { ...body, per_page: 3 }, fetchImpl)) as {
      people?: Array<PersonHit>;
    };

  // One search per company — api_search's embedded organization object carries
  // no id, so a combined query cannot attribute people back to their org.
  const firstPerOrg = new Map<string, string>();
  await Promise.all(
    orgs.map(async (o) => {
      const passes: Array<Record<string, unknown>> = [
        { organization_ids: [o.id], person_seniorities: SENIORITIES },
        { organization_ids: [o.id] },
        ...(o.domain ? [{ q_organization_domains_list: [o.domain], person_seniorities: SENIORITIES }] : []),
      ];
      for (const body of passes) {
        const hit = (await search(body)).people?.find((p) => p.id);
        if (hit?.id) {
          firstPerOrg.set(o.id, hit.id);
          return;
        }
      }
    }),
  );

  // Reveal each pick via people/match — one enrichment credit per contact
  // (max 5 per demo run). Personal emails stay unrevealed.
  const byOrg = new Map<string, ApolloContact>();
  await Promise.all(
    [...firstPerOrg.entries()].map(async ([orgId, personId]) => {
      const res = await fetchImpl(
        `${API}/people/match?id=${personId}&reveal_personal_emails=false`,
        { method: 'POST', headers: { 'x-api-key': apiKey, 'content-type': 'application/json' } },
      );
      if (!res.ok) return;
      const body = (await res.json()) as {
        person?: { name?: string; title?: string | null; email?: string | null; linkedin_url?: string | null };
      };
      const p = body.person;
      if (!p?.name) return;
      byOrg.set(orgId, {
        name: p.name,
        title: p.title ?? null,
        organization_id: orgId,
        linkedin_url: p.linkedin_url ?? null,
        email: p.email && !p.email.includes('not_unlocked') ? p.email : null,
      });
    }),
  );
  console.log('contacts_summary', {
    requested: orgs.map((o) => `${o.id}:${o.domain}`),
    searched: firstPerOrg.size,
    revealed: byOrg.size,
  });
  return byOrg;
}
