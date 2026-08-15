import { describe, expect, it } from 'vitest';
import { renderProspectsEmail } from './email';

const icp = {
  icp_summary: 'Industrial distributors in LATAM',
  buyer_segments: ['distribution'],
  buyer_titles: ['VP Sales'],
  sales_motion: 'B2B direct',
};

const leads = [
  {
    company: 'Acme <Corp>',
    website: 'https://acme.com',
    location: 'Monterrey, Mexico',
    employees: 120,
    industry: 'machinery',
    contact: { name: 'Luis Pérez', title: 'VP Sales', linkedinUrl: null },
    whyFit: 'Distributes industrial machinery in the target region.',
  },
];

describe('renderProspectsEmail', () => {
  it('escapes HTML and carries brand + CTA + disclaimer', () => {
    const { html, text } = renderProspectsEmail('Ana', 'Hidrorey', icp, leads);
    expect(html).toContain('Acme &lt;Corp&gt;');
    expect(html).not.toContain('Acme <Corp>');
    expect(html).toContain('Anytrail');
    expect(html).toContain('https://anytrail.ai');
    expect(html).toContain('one-time email');
    expect(html).toContain('#2f6f4f');
    expect(text).toContain('Luis Pérez (VP Sales)');
    expect(text).toContain('No follow-ups');
  });

  it('shows the brand lockup rather than a web-font wordmark', () => {
    const { html } = renderProspectsEmail('Ana', 'Hidrorey', icp, leads);
    expect(html).toContain('https://www.anytrail.ai/anytrail-logo.png');
    expect(html).toContain('alt="Anytrail"');
    expect(html).toContain('width="130"');
    // Mail clients do not load @font-face, so a text wordmark fell back to
    // whatever the client had and never matched the site.
    expect(html).not.toContain('Montserrat');
  });
});
