import { describe, expect, it } from 'vitest';
import { formatSlot, icsUidFor, renderConfirmation, renderReminder } from './email';

const booking = {
  slotStartUtc: '2026-08-20T18:30:00.000Z',
  name: 'Ana <script>',
  email: 'ana@acme.com',
  website: 'https://acme.com',
  note: '',
  lang: 'en' as const,
  remindedT24: false,
  remindedT1: false,
  createdAt: '2026-08-19T12:00:00.000Z',
  ip: '1.2.3.4',
};

const MANAGE = 'https://www.anytrail.ai/schedule?b=2026-08-20T18%3A30%3A00.000Z&s=abc';
// The `&` above is a real attribute-breakout vector inside href="...", so the
// HTML body carries the escaped form; the plain-text body carries MANAGE raw.
const MANAGE_ESCAPED = 'https://www.anytrail.ai/schedule?b=2026-08-20T18%3A30%3A00.000Z&amp;s=abc';
const MEET = 'https://meet.google.com/kzk-tpgh-sbm';

describe('renderConfirmation', () => {
  it('escapes HTML, carries the brand, the meet link, the manage link and the demo CTA', () => {
    const { html, text, subject } = renderConfirmation(booking, MANAGE, MEET);
    expect(html).toContain('Ana &lt;script&gt;');
    expect(html).not.toContain('<script>');
    expect(html).toContain('#2f6f4f');
    expect(html).toContain(MEET);
    expect(html).toContain(MANAGE_ESCAPED);
    expect(html).toContain('/demo');
    expect(text).toContain(MEET);
    expect(text).toContain(MANAGE);
    // Regex, not a literal substring: ICU may separate the time from the
    // meridiem with a narrow no-break space (U+202F) on some Node/ICU
    // builds instead of a plain space, and a literal "2:30 PM" would then
    // fail on a string that looks identical in a diff.
    expect(subject).toMatch(/2:30\s?PM/);
  });

  it('renders the Spanish version when lang is es', () => {
    const { html } = renderConfirmation({ ...booking, lang: 'es' }, MANAGE, MEET);
    expect(html).toContain('Tu llamada');
    expect(html).not.toContain('Your call');
  });

  it('never uses an em dash, in either language', () => {
    for (const lang of ['en', 'es'] as const) {
      const { html, text } = renderConfirmation({ ...booking, lang }, MANAGE, MEET);
      expect(html).not.toContain('—');
      expect(text).not.toContain('—');
    }
  });
});

describe('renderReminder', () => {
  it('says tomorrow at T-24 and shortly at T-1', () => {
    expect(renderReminder(booking, MANAGE, MEET, 'T24').subject.toLowerCase()).toContain('tomorrow');
    expect(renderReminder(booking, MANAGE, MEET, 'T1').subject.toLowerCase()).toContain('hour');
  });

  it('never uses an em dash, in either language or reminder variant', () => {
    for (const lang of ['en', 'es'] as const) {
      for (const which of ['T24', 'T1'] as const) {
        const { html, text } = renderReminder({ ...booking, lang }, MANAGE, MEET, which);
        expect(html).not.toContain('—');
        expect(text).not.toContain('—');
      }
    }
  });
});

describe('formatSlot', () => {
  it('names the host time zone in Spanish instead of a raw GMT offset', () => {
    // The old `timeZoneName: 'short'` rendered es-MX as "GMT-4": an offset
    // with no signal it is US Eastern, exactly the no-show failure the
    // "zone named" constraint exists to prevent.
    const es = formatSlot(booking.slotStartUtc, 'es');
    expect(es).not.toContain('GMT');
  });
});

describe('icsUidFor', () => {
  it('is stable across a reschedule (same booking, different slot)', () => {
    const rescheduled = { ...booking, slotStartUtc: '2026-08-21T20:00:00.000Z' };
    expect(icsUidFor(rescheduled)).toBe(icsUidFor(booking));
  });

  it('differs for a different booking (different createdAt)', () => {
    const otherBooking = { ...booking, createdAt: '2026-08-19T13:00:00.000Z' };
    expect(icsUidFor(otherBooking)).not.toBe(icsUidFor(booking));
  });
});
