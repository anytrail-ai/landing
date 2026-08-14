import { describe, expect, it } from 'vitest';
import type { Booking } from '../schedule/store';
import { dueReminders } from './handler';

const base: Booking = {
  slotStartUtc: '',
  name: 'Ana',
  email: 'ana@acme.com',
  website: 'https://acme.com',
  note: '',
  lang: 'en',
  remindedT24: false,
  remindedT1: false,
  createdAt: '2026-08-19T12:00:00.000Z',
  ip: '1.2.3.4',
};

const now = Date.parse('2026-08-20T12:00:00.000Z');
const at = (offsetMs: number, over: Partial<Booking> = {}): Booking => ({
  ...base,
  ...over,
  slotStartUtc: new Date(now + offsetMs).toISOString(),
});

const H = 60 * 60 * 1000;

describe('dueReminders', () => {
  it('sends T-24 inside the sweep window and not before it', () => {
    // Sweep runs every 15 minutes, so the window is [24h - 15m, 24h].
    expect(dueReminders([at(23.9 * H)], now)[0]?.which).toBe('T24');
    expect(dueReminders([at(30 * H)], now)).toEqual([]);
  });

  it('sends T-1 inside its window', () => {
    expect(dueReminders([at(0.9 * H)], now)[0]?.which).toBe('T1');
  });

  it('skips flags that are already set', () => {
    expect(dueReminders([at(23.9 * H, { remindedT24: true })], now)).toEqual([]);
    expect(dueReminders([at(0.9 * H, { remindedT1: true })], now)).toEqual([]);
  });

  it('never reminds about a call that already started', () => {
    expect(dueReminders([at(-1 * H)], now)).toEqual([]);
  });
});
