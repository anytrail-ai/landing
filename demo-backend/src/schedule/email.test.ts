import { describe, expect, it } from 'vitest';
import { renderConfirmation, renderReminder } from './email';

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
const MEET = 'https://meet.google.com/kzk-tpgh-sbm';

describe('renderConfirmation', () => {
  it('escapes HTML, carries the brand, the meet link, the manage link and the demo CTA', () => {
    const { html, text, subject } = renderConfirmation(booking, MANAGE, MEET);
    expect(html).toContain('Ana &lt;script&gt;');
    expect(html).not.toContain('<script>');
    expect(html).toContain('#2f6f4f');
    expect(html).toContain(MEET);
    expect(html).toContain(MANAGE);
    expect(html).toContain('/demo');
    expect(text).toContain(MEET);
    expect(subject).toContain('2:30 PM');
  });

  it('renders the Spanish version when lang is es', () => {
    const { html } = renderConfirmation({ ...booking, lang: 'es' }, MANAGE, MEET);
    expect(html).toContain('Tu llamada');
    expect(html).not.toContain('Your call');
  });

  it('never uses an em dash', () => {
    const { html, text } = renderConfirmation(booking, MANAGE, MEET);
    expect(html).not.toContain('—');
    expect(text).not.toContain('—');
  });
});

describe('renderReminder', () => {
  it('says tomorrow at T-24 and shortly at T-1', () => {
    expect(renderReminder(booking, MANAGE, MEET, 'T24').subject.toLowerCase()).toContain('tomorrow');
    expect(renderReminder(booking, MANAGE, MEET, 'T1').subject.toLowerCase()).toContain('hour');
  });
});
