import { SCHEDULE } from './config';

// RFC 5545: backslash, semicolon, comma and newline are the escapes that matter.
// Used for TEXT values (SUMMARY, DESCRIPTION, LOCATION).
function escText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// RFC 5545 §3.2: parameter values use quoted-string when they contain special chars.
// Backslash is not a valid escape in parameter values; use double quotes instead.
function escParam(s: string): string {
  // Strip any double quotes from the value first (quoted-string cannot contain them)
  const clean = s.replace(/"/g, '');
  // Wrap in quotes if it contains `,`, `;`, or `:`
  if (/[,;:]/.test(clean)) {
    return `"${clean}"`;
  }
  return clean;
}

/** 2026-08-20T18:30:00.000Z -> 20260820T183000Z */
function stamp(at: Date): string {
  return `${at.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

// Strip CRLF from values that will be interpolated into property lines
function stripNewlines(s: string): string {
  return s.replace(/[\r\n]/g, '');
}

export interface IcsInput {
  slotStartUtc: string;
  attendeeEmail: string;
  attendeeName: string;
  organizerEmail: string;
  meetUrl: string;
  summary: string;
  description: string;
  uid: string;
  sequence?: number;
}

export function buildIcs(input: IcsInput): string {
  const start = new Date(input.slotStartUtc);
  const end = new Date(start.getTime() + SCHEDULE.slotMinutes * 60_000);
  const sequence = input.sequence ?? 0;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Anytrail//Scheduling//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${input.uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escText(input.summary)}`,
    `DESCRIPTION:${escText(input.description)}`,
    `LOCATION:${escText(input.meetUrl)}`,
    `SEQUENCE:${sequence}`,
    `ORGANIZER;CN=Anytrail:mailto:${stripNewlines(input.organizerEmail)}`,
    `ATTENDEE;CN=${escParam(input.attendeeName)};RSVP=TRUE:mailto:${stripNewlines(input.attendeeEmail)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
