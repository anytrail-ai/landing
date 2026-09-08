import { describe, expect, it } from 'vitest'
import { fill, phoneDigits, phoneLooksValid } from './phone'

describe('phoneDigits', () => {
  it('strips everything but digits', () => {
    expect(phoneDigits('+52 1 (81) 2764-8080')).toBe('5218127648080')
    expect(phoneDigits('call me')).toBe('')
  })
})

describe('phoneLooksValid', () => {
  it('accepts 8 to 15 digits in any formatting', () => {
    expect(phoneLooksValid('+52 81 2764 8080')).toBe(true)
    expect(phoneLooksValid('81276480')).toBe(true)
    expect(phoneLooksValid('123456789012345')).toBe(true)
  })

  it('rejects too short, too long, or no digits', () => {
    expect(phoneLooksValid('1234567')).toBe(false)
    expect(phoneLooksValid('1234567890123456')).toBe(false)
    expect(phoneLooksValid('')).toBe(false)
    expect(phoneLooksValid('ana@acme.com')).toBe(false)
  })
})

describe('fill', () => {
  it('replaces known slots and leaves unknown ones visible', () => {
    expect(fill('Thanks, {name}.', { name: 'Ana' })).toBe('Thanks, Ana.')
    expect(fill('{a} and {b}', { a: 'x' })).toBe('x and {b}')
  })
})
