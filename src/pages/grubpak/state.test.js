import { describe, expect, it } from 'vitest'
import { initialState, nextPending, reducer, stage } from './state'

const T0 = '2026-10-05T16:00:00.000Z'
const run = (actions, s = { ...initialState, simNow: T0 }) => actions.reduce(reducer, s)

describe('grubpak reducer', () => {
  it('streams agent text into the channel of the turn', () => {
    const s = run([
      { type: 'send', text: 'hola', channel: 'web' },
      { type: 'delta', text: 'Qué ' },
      { type: 'delta', text: 'tal' },
      { type: 'done' },
      { type: 'followup_start', label: 'Carrito abandonado', step: { title: 'Duda', channel: 'wa', subject: null, action: 'resume' } },
      { type: 'delta', text: '¿Alguna duda?' },
    ])
    expect(s.messages.map((m) => [m.kind, m.channel, m.text])).toEqual([
      ['user', 'web', 'hola'],
      ['agent', 'web', 'Qué tal'],
      ['agent', 'wa', '¿Alguna duda?'],
    ])
    expect(s.messages[2].action).toBe('resume')
  })

  it('starts a new bubble after the checkout link', () => {
    const s = run([
      { type: 'send', text: 'va', channel: 'web' },
      { type: 'delta', text: 'Aquí está' },
      { type: 'checkout_link', url: 'u', totalMxn: 10 },
      { type: 'delta', text: '\n\nCualquier duda me dices' },
    ])
    expect(s.messages.map((m) => m.kind)).toEqual(['user', 'agent', 'link', 'agent'])
    expect(s.messages[3].text).toBe('Cualquier duda me dices')
  })

  it('rolls back a failed turn but keeps the clock', () => {
    const before = run([])
    const s = run([{ type: 'send', text: 'x', channel: 'web' }, { type: 'clock', simNow: '2026-10-06T16:00:00.000Z' }, { type: 'rollback', snapshot: before }], before)
    expect(s.messages).toEqual([])
    expect(s.simNow).toBe('2026-10-06T16:00:00.000Z')
  })

  it('tracks the pipeline stage', () => {
    expect(stage(run([]))).toBe('nuevo')
    const s = run([{ type: 'shop', topic: 'checkouts/create', detail: '' }, { type: 'order', order: { number: '#GP1041' } }])
    expect(stage(s)).toBe('compro')
    expect(s.checkout.status).toBe('paid')
  })
})

it('nextPending finds the earliest pending step across sequences', () => {
  const seqs = [
    { id: 'a', steps: [{ id: '1', status: 'sent', at: '2026-10-05T16:30:00Z' }, { id: '2', status: 'pending', at: '2026-10-06T16:00:00Z' }] },
    { id: 'b', steps: [{ id: '3', status: 'pending', at: '2026-10-05T17:00:00Z' }, { id: '4', status: 'cancelled', at: '2026-10-05T16:10:00Z' }] },
  ]
  expect(nextPending(seqs)).toMatchObject({ seq: { id: 'b' }, step: { id: '3' } })
  expect(nextPending([])).toBeNull()
})
