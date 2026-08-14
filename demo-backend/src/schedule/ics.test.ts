import { describe, expect, it } from 'vitest';
import { buildIcs } from './ics';

const input = {
  slotStartUtc: '2026-08-20T18:30:00.000Z',
  attendeeEmail: 'ana@acme.com',
  attendeeName: 'Ana',
  organizerEmail: 'agent@demo.anytrail.ai',
  meetUrl: 'https://meet.google.com/kzk-tpgh-sbm',
  summary: 'Anytrail: commercial process review',
  description: 'A 30 minute call.',
};

describe('buildIcs', () => {
  it('emits a REQUEST with UTC stamps 30 minutes apart', () => {
    const ics = buildIcs(input);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('METHOD:REQUEST');
    expect(ics).toContain('DTSTART:20260820T183000Z');
    expect(ics).toContain('DTEND:20260820T190000Z');
    expect(ics).toContain('LOCATION:https://meet.google.com/kzk-tpgh-sbm');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('escapes commas and newlines, which would otherwise break parsing', () => {
    const ics = buildIcs({ ...input, description: 'Line one\nLine, two' });
    expect(ics).toContain('Line one\\nLine\\, two');
  });

  it('uses CRLF line endings, which strict parsers require', () => {
    expect(buildIcs(input).includes('\r\n')).toBe(true);
  });
});
