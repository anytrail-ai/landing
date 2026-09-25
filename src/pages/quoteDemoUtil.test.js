import { describe, expect, it } from 'vitest'
import { money, parsePriceInput, stripQuoteMarker } from './quoteDemoUtil'

describe('stripQuoteMarker', () => {
  it('removes the full marker and reports ready', () => {
    expect(stripQuoteMarker('Listo, te cotizo 2 piezas. [[COTIZAR]]')).toEqual({ text: 'Listo, te cotizo 2 piezas.', ready: true })
  })
  it('hides a partial marker at the end of a streaming buffer', () => {
    expect(stripQuoteMarker('Listo [[COT')).toEqual({ text: 'Listo', ready: false })
    expect(stripQuoteMarker('Listo [')).toEqual({ text: 'Listo', ready: false })
  })
  it('leaves normal text alone', () => {
    expect(stripQuoteMarker('Hola [marca] 3/8')).toEqual({ text: 'Hola [marca] 3/8', ready: false })
  })
})

describe('money', () => {
  it('formats cents', () => {
    expect(money(1850000, 'MXN')).toBe('$18,500.00 MXN')
  })
})

describe('parsePriceInput', () => {
  it('accepts plain and formatted amounts', () => {
    expect(parsePriceInput('1234.5')).toBe(123450)
    expect(parsePriceInput('$1,234.50')).toBe(123450)
    expect(parsePriceInput('0')).toBe(0)
  })
  it('rejects blanks, negatives and junk', () => {
    expect(parsePriceInput('')).toBeNull()
    expect(parsePriceInput('-3')).toBeNull()
    expect(parsePriceInput('mil')).toBeNull()
  })
})
