import { SCHEDULE } from './config';

// RFC 5545: backslash, semicolon, comma and newline are the escapes that matter.
function escText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** 2026-08-20T18:30:00.000Z -> 20260820T183000Z */
function stamp(at: Date): string {
  return `${at.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

export interface IcsInput {
  slotStartUtc: string;
  attendeeEmail: string;
  attendeeName: string;
  organizerEmail: string;
  meetUrl: string;
  summary: string;
  description: string;
}

export function buildIcs(input: IcsInput): string {
  const start = new Date(input.slotStartUtc);
  const end = new Date(start.getTime() + SCHEDULE.slotMinutes * 60_000);
  // Deterministic from the slot: a reschedule mail for the same slot updates
  // the same calendar entry instead of creating a duplicate.
  const uid = `anytrail-${stamp(start)}@anytrail.ai`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Anytrail//Scheduling//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escText(input.summary)}`,
    `DESCRIPTION:${escText(input.description)}`,
    `LOCATION:${escText(input.meetUrl)}`,
    `ORGANIZER;CN=Anytrail:mailto:${input.organizerEmail}`,
    `ATTENDEE;CN=${escText(input.attendeeName)};RSVP=TRUE:mailto:${input.attendeeEmail}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
