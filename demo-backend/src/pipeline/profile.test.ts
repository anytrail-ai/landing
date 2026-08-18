import { describe, expect, it } from 'vitest';
import { companyProfileSchema, renderProfile } from './profile';
import { pickUrls } from './firecrawl';

const profile = companyProfileSchema.parse({
  companyName: 'Acme',
  positioning: 'Industrial widgets for OEMs',
  products: [
    { name: 'Widget A', description: 'A widget', price: '$10' },
    { name: 'Widget B', description: 'Another widget', price: null },
  ],
  targetAudience: 'OEM purchasing managers',
  language: 'en',
  toneHints: 'direct, technical',
});

describe('companyProfileSchema', () => {
  it('defaults language to en when the model omits it', () => {
    const { language, ...withoutLanguage } = profile;
    const parsed = companyProfileSchema.parse(withoutLanguage);
    expect(parsed.language).toBe('en');
  });

  it('keeps an explicit language', () => {
    expect(companyProfileSchema.parse({ ...profile, language: 'es-MX' }).language).toBe('es-MX');
  });
});

describe('renderProfile', () => {
  it('wraps content in the injection boundary', () => {
    const out = renderProfile(profile);
    expect(out).toMatch(/^=== BEGIN VISITOR COMPANY DATA/);
    expect(out).toMatch(/=== END VISITOR COMPANY DATA ===$/);
    expect(out).toContain('- Widget A: A widget ($10)');
    expect(out).toContain('- Widget B: Another widget');
  });

  it('stays within the char budget on huge profiles', () => {
    const big = {
      ...profile,
      products: Array.from({ length: 500 }, (_, i) => ({
        name: `P${i}`,
        description: 'x'.repeat(100),
        price: null,
      })),
    };
    expect(renderProfile(big).length).toBeLessThan(4200);
  });
});

describe('pickUrls', () => {
  it('keeps the homepage first and prefers product-ish paths', () => {
    const urls = pickUrls(
      [
        'https://a.com/blog/post-1',
        'https://a.com/products/widget',
        'https://a.com/contact',
        'https://a.com/services',
        'https://a.com/pricing',
      ],
      'https://a.com',
      4,
    );
    expect(urls[0]).toBe('https://a.com');
    expect(urls).toContain('https://a.com/products/widget');
    expect(urls).toContain('https://a.com/services');
    expect(urls).toContain('https://a.com/pricing');
    expect(urls).toHaveLength(4);
  });
});
