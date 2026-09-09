import { describe, expect, it } from 'vitest';
import { boardSchema } from './board';

// Guards the parse contract the Bedrock prompt promises: a minimal model
// answer must survive, and the optional blocks (quote, delivery) must default
// cleanly when absent.
describe('boardSchema', () => {
  it('accepts a minimal card and defaults severity/conversation', () => {
    const parsed = boardSchema.parse({
      buckets: {
        atRisk: [
          {
            customerName: 'Laura Peña',
            lastMessage: 'sigo esperando la cotización…',
            waitingHours: 72,
            reason: 'Prometieron cotizar el martes',
          },
        ],
        intent: [],
        followUp: [],
        revive: [],
      },
    });
    const card = parsed.buckets.atRisk[0]!;
    expect(card.severity).toBe('medium');
    expect(card.conversation).toEqual([]);
    expect(card.quote ?? null).toBeNull();
  });

  it('rejects a bucket payload missing a bucket', () => {
    expect(() =>
      boardSchema.parse({ buckets: { atRisk: [], intent: [], followUp: [] } }),
    ).toThrow();
  });
});
