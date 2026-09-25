import { describe, expect, it } from 'vitest';
import { dueQuoteReminders } from './reminder-handler';
import type { PriceRequest } from './types';

const base: PriceRequest = {
  token: 't', quoteId: 'q', catalogId: 'c', supplier: 'S', currency: 'MXN', to: 'a@b.co', subject: 's', body: 'b',
  items: [], status: 'pending', remindersSent: 0, nextReminderAt: 1000, createdAt: '',
};

describe('dueQuoteReminders', () => {
  it('is due at or after nextReminderAt while pending and under the cap', () => {
    expect(dueQuoteReminders([base], 999)).toEqual([]);
    expect(dueQuoteReminders([base], 1000)).toEqual([base]);
  });
  it('skips answered requests and requests at the cap', () => {
    expect(dueQuoteReminders([{ ...base, status: 'answered' }], 5000)).toEqual([]);
    expect(dueQuoteReminders([{ ...base, remindersSent: 5 }], 5000)).toEqual([]);
    expect(dueQuoteReminders([{ ...base, remindersSent: 4 }], 5000)).toHaveLength(1);
  });
});
