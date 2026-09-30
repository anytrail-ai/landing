import { describe, expect, it } from 'vitest'
import { bubbles, initialState, reducer } from './state'

const run = (actions, s = initialState) => actions.reduce(reducer, s)

describe('celdas reducer', () => {
  it('orders text, PDF and email as the agent produced them', () => {
    const s = run([
      { type: 'send', text: 'Juan, juan@x.com' },
      { type: 'delta', text: 'Un momento.' },
      { type: 'tool', id: 't1', name: 'generar_cotizacion', input: {} },
      { type: 'quote', quote: { folio: 'CEL-1', totalUsd: 580 }, filename: 'c.pdf', url: 'blob:1' },
      { type: 'tool_result', id: 't1', ok: true, label: 'Folio CEL-1' },
      { type: 'email', to: 'juan@x.com', folio: 'CEL-1' },
      { type: 'delta', text: '\n\n' },
      { type: 'delta', text: 'Listo.' },
      { type: 'done' },
    ])
    expect(s.chat.map((c) => c.kind)).toEqual(['user', 'agent', 'pdf', 'email', 'agent'])
    expect(bubbles(s.chat[4].text)).toEqual(['Listo.'])
    expect(s.trace[0].steps[0]).toMatchObject({ kind: 'tool', ok: true, label: 'Folio CEL-1' })
    expect(s.busy).toBe(false)
  })

  it('streams thinking into one step per block and attaches the calc to the running tool', () => {
    const s = run([
      { type: 'send', text: 'hola' },
      { type: 'thinking_start' },
      { type: 'thinking', text: 'Necesito ' },
      { type: 'thinking', text: 'capacidad.' },
      { type: 'thinking_end' },
      { type: 'tool', id: 't1', name: 'dimensionar_celdas', input: {} },
      { type: 'calc', explanation: '1,350 lb por celda' },
      { type: 'thinking_start' },
      { type: 'thinking', text: 'Ya está.' },
    ])
    const steps = s.trace[0].steps
    expect(steps.map((x) => x.kind)).toEqual(['thinking', 'tool', 'thinking'])
    expect(steps[0]).toMatchObject({ text: 'Necesito capacidad.', done: true })
    expect(steps[1].calc).toBe('1,350 lb por celda')
    expect(steps[2]).toMatchObject({ text: 'Ya está.', done: false })
  })

  it('rolls a failed turn back to its snapshot', () => {
    const before = run([{ type: 'session', sessionId: 's1' }])
    const s = run([{ type: 'send', text: 'x' }, { type: 'delta', text: 'y' }, { type: 'rollback', snapshot: before }], before)
    expect(s.chat).toEqual([])
    expect(s.trace).toEqual([])
    expect(s.sessionId).toBe('s1')
  })
})

describe('follow-ups', () => {
  it('adds an automatic turn with no customer bubble, then takes the server schedule', () => {
    const s = run([
      { type: 'send', text: 'hola' },
      { type: 'delta', text: 'Listo, ahí va su PDF.' },
      { type: 'done' },
      { type: 'followup_state', followUp: { count: 0, max: 3, closed: false, dueAt: '2026-09-30T20:00:00Z' } },
      { type: 'followup_start', number: 1 },
      { type: 'delta', text: '¿Pudo revisar la cotización?' },
      { type: 'followup_state', followUp: { count: 1, max: 3, closed: false, dueAt: '2026-09-30T20:05:00Z' } },
      { type: 'done' },
    ])
    expect(s.chat.map((c) => c.text)).toEqual(['hola', 'Listo, ahí va su PDF.', '¿Pudo revisar la cotización?'])
    expect(s.trace[1]).toMatchObject({ auto: 1, userText: null })
    expect(s.followUp).toMatchObject({ count: 1, dueAt: '2026-09-30T20:05:00Z' })
  })

  it('clears the pending timer while a follow-up runs so it cannot fire twice', () => {
    const s = run([
      { type: 'followup_state', followUp: { count: 0, max: 3, closed: false, dueAt: '2026-09-30T20:00:00Z' } },
      { type: 'followup_start', number: 1 },
    ])
    expect(s.followUp.dueAt).toBeNull()
    expect(s.busy).toBe(true)
  })
})
