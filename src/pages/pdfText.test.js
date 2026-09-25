import { describe, expect, it } from 'vitest'
import { itemsToLines } from './pdfText'

// pdf.js text items: `str` plus a transform whose [4] is x and [5] is y
// (PDF user space, y grows upward).
const item = (str, x, y) => ({ str, transform: [1, 0, 0, 1, x, y] })

describe('itemsToLines', () => {
  it('rebuilds rows in visual order, not content-stream order', () => {
    const items = [
      item('$18,500.00', 400, 700),
      item('HP-2500E', 50, 700),
      item('Hidrolavadora eléctrica 2500 PSI', 150, 700),
      item('MAP-15', 50, 680),
      item('$1,250.00', 400, 680),
      item('Manguera 15 m', 150, 680),
    ]
    expect(itemsToLines(items)).toEqual([
      'HP-2500E Hidrolavadora eléctrica 2500 PSI $18,500.00',
      'MAP-15 Manguera 15 m $1,250.00',
    ])
  })

  it('keeps items a couple of units apart vertically on the same row', () => {
    const items = [item('Bomba', 50, 500.4), item('$3,450.00', 400, 498.9)]
    expect(itemsToLines(items)).toEqual(['Bomba $3,450.00'])
  })

  it('drops empty and whitespace-only items', () => {
    const items = [item('  ', 10, 100), item('Filtro', 50, 100), item('', 60, 100)]
    expect(itemsToLines(items)).toEqual(['Filtro'])
  })

  it('ignores items without a position (marked-content markers)', () => {
    expect(itemsToLines([{ type: 'beginMarkedContent' }, item('Lanza', 50, 300)])).toEqual(['Lanza'])
  })
})
