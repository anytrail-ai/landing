import { describe, expect, it } from 'vitest';
import { buildClosingInstruction, buildSystemText } from './agent';
import { companyProfileSchema } from '../pipeline/profile';

const profile = companyProfileSchema.parse({
  companyName: 'Acme',
  positioning: 'Widgets',
  products: [{ name: 'Widget A', description: 'A widget', price: '$10' }],
  targetAudience: 'OEMs',
  language: 'es-MX',
  toneHints: 'warm',
});

describe('buildSystemText', () => {
  it('embeds company, visitor, language, and the boundary block', () => {
    const s = buildSystemText(profile, 'Ana');
    expect(s).toContain('top salesperson for Acme');
    expect(s).toContain('chatting with Ana');
    expect(s).toContain('website is in: es-MX');
    expect(s).toContain('Respond in English by default');
    expect(s).toContain('=== BEGIN VISITOR COMPANY DATA');
    expect(s).toContain('Widget A');
    expect(s).toContain('Never invent products or prices');
  });
});

describe('buildClosingInstruction', () => {
  it('carries the Anytrail CTA', () => {
    expect(buildClosingInstruction()).toContain('https://anytrail.ai');
  });
});
