import { describe, expect, it } from 'vitest';
import { SE_ALERT, UnknownPartError, findPart, partForCapacity, priceLines, sizeCells } from './catalog';

describe('sizeCells', () => {
  it('reproduces the brief example: 5,000 lb + 400 lb deck on 4 cells → 350NUS002 × 4', () => {
    const r = sizeCells({ capacityLb: 5000, deadLoadLb: 400, cells: 4, impact: false });
    expect(r.recommended.perCellLb).toBe(1350);
    expect(r.recommended.designLb).toBe(1687.5);
    expect(r.recommended.part?.partNumber).toBe('350NUS002');
    expect(r.recommended.totalUsd).toBe(580);
    expect(r.alternative).toBeNull();
  });

  it('uses 1.5 with impact', () => {
    const r = sizeCells({ capacityLb: 5000, deadLoadLb: 400, cells: 4, impact: true });
    expect(r.recommended.designLb).toBe(2025);
    expect(r.recommended.part?.partNumber).toBe('350NUS205');
  });

  it('just above 5 klb, offers 6 cells of ≤5 klb when cheaper than 4 × 10 klb', () => {
    // 17,000 + 1,000 = 18,000 / 4 = 4,500 × 1.25 = 5,625 → 10 klb ($1,000 for 4)
    // 18,000 / 6 = 3,000 × 1.25 = 3,750 → 4 klb ($870 for 6)
    const r = sizeCells({ capacityLb: 17000, deadLoadLb: 1000, cells: 4, impact: false });
    expect(r.alternative).not.toBeNull();
    expect(r.recommended.cells).toBe(6);
    expect(r.recommended.part?.partNumber).toBe('350NUS004');
    expect(r.recommended.totalUsd).toBe(870);
    expect(r.explanation).toContain('más económico');
  });

  it('adds cells when 4 would need more than 10 klb each', () => {
    // 60,000 / 4 × 1.25 = 18,750 per cell: no 350N. 16 cells → 4,687.5 → 5 klb.
    const r = sizeCells({ capacityLb: 60000, deadLoadLb: 0, cells: 4, impact: false });
    expect(r.recommended.cells).toBe(16);
    expect(r.recommended.part?.partNumber).toBe('350NUS005-SE');
    expect(r.explanation).toContain('excede 10 klb');
  });
});

describe('parts', () => {
  it('rounds capacity up to the next part', () => {
    expect(partForCapacity(1001)?.partNumber).toBe('350NUS105');
    expect(partForCapacity(250)?.partNumber).toBe('350NUS250');
    expect(partForCapacity(10001)).toBeNull();
  });

  it('matches part numbers case- and space-insensitively', () => {
    expect(findPart(' 350nus005-se ')?.capacityLb).toBe(5000);
    expect(findPart('350NUS003')).toBeNull();
  });
});

describe('priceLines', () => {
  it('prices from the catalogue and flags -SE', () => {
    const r = priceLines([
      { partNumber: '350NUS005-SE', qty: 4 },
      { partNumber: '350NUS010', qty: 1 },
    ]);
    expect(r.totalUsd).toBe(4 * 145 + 250);
    expect(r.alerts).toEqual([SE_ALERT]);
  });

  it('rejects unknown parts', () => {
    expect(() => priceLines([{ partNumber: 'H8C-C3-2.0t', qty: 4 }])).toThrow(UnknownPartError);
  });
});
