import { outboundFetch } from '../net/outbound-fetch';
import type { ApolloFilters } from './icp';

const API = 'https://api.apollo.io/api/v1';

export interface ApolloOrg {
  id: string;
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
}

interface ApolloDeps {
  fetchImpl?: typeof fetch;
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
  const orgs = [...(data.organizations ?? []), ...(data.accounts ?? [])];
  // Never recommend the visitor to themselves. Callers over-fetch and trim to
  // 5 after the why-fit filter drops non-matches.
  return orgs.filter((o) => o.primary_domain !== excludeDomain).slice(0, 12);
}

export async function findContacts(
  orgIds: string[],
  titles: string[],
  apiKey: string,
  deps: ApolloDeps = {},
): Promise<Map<string, ApolloContact>> {
  const fetchImpl = deps.fetchImpl ?? outboundFetch;
  if (!orgIds.length) return new Map();
  const data = (await post('/mixed_people/search', apiKey, {
    organization_ids: orgIds,
    person_titles: titles.slice(0, 10),
    per_page: 25,
    page: 1,
  }, fetchImpl)) as {
    people?: Array<{
      name?: string;
      title?: string | null;
      organization_id?: string | null;
      linkedin_url?: string | null;
    }>;
  };
  const byOrg = new Map<string, ApolloContact>();
  for (const p of data.people ?? []) {
    if (!p.organization_id || !p.name || byOrg.has(p.organization_id)) continue;
    byOrg.set(p.organization_id, {
      name: p.name,
      title: p.title ?? null,
      organization_id: p.organization_id,
      linkedin_url: p.linkedin_url ?? null,
    });
  }
  return byOrg;
}
