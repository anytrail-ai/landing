import { describe, expect, it } from 'vitest'
import { emptyState, pendientes, reducer, reviewQueue, searchExpedientes, statusOf } from './engine'
import { CHATS, scenarioFor } from './scenario'

const cls = (kind, ids = {}, fields = {}, extra = {}) => ({
  kind,
  identifiers: { numero: null, poliza: null, placas: null, ...ids },
  fields,
  matchId: null,
  confidence: 'alta',
  summary: '',
  relevant: true,
  ...extra,
})

function run(steps, chats = CHATS) {
  let s = reducer(emptyState(), { type: 'chats', chats })
  for (const [message, c] of steps) {
    s = reducer(s, { type: 'receive', message })
    s = reducer(s, { type: 'classified', messageId: message.id, classification: c })
  }
  return s
}

const msg = (id, chatId, at, extra = {}) => ({ id, chatId, sender: 'X', at: `2026-09-24T${at}:00-06:00`, ...extra })

describe('filing', () => {
  it('opens an expediente on the first identifier and matches later ones to it', () => {
    const s = run([
      [msg('a', 'g-qualitas', '09:00'), cls('mensaje', { numero: '04-2291834' }, { aseguradora: 'Qualitas' })],
      [msg('b', 'p-jorge', '10:00'), cls('reporte', { numero: '042291834', poliza: 'P-1' })],
    ])
    expect(s.expedienteOrder).toHaveLength(1)
    const exp = s.expedientes[s.expedienteOrder[0]]
    expect(exp.items).toEqual(['a', 'b'])
    expect(exp.poliza).toBe('P-1')
    expect(s.messages.b.assignment).toBe('identificador')
  })

  it('never overwrites a field a previous document already filled', () => {
    const s = run([
      [msg('a', 'p-jorge', '09:00'), cls('poliza', { poliza: 'P-1' }, { vehiculo: 'Kia Rio 2020' })],
      [msg('b', 'p-jorge', '09:01'), cls('mensaje', { poliza: 'P-1' }, { vehiculo: 'Kia' })],
    ])
    const exp = s.expedientes[s.expedienteOrder[0]]
    expect(exp.vehiculo).toBe('Kia Rio 2020')
    expect(exp.sources.vehiculo).toBe('a')
  })

  it('files an unlabelled photo by the chat context, but only within the group window', () => {
    const s = run([
      [msg('a', 'g-ajustadores', '09:00'), cls('mensaje', { numero: 'N-1' })],
      [msg('b', 'g-ajustadores', '09:10', { attachment: { type: 'photo' } }), cls('foto')],
      [msg('c', 'g-ajustadores', '09:40', { attachment: { type: 'photo' } }), cls('foto')],
    ])
    expect(s.messages.b.assignment).toBe('contexto')
    expect(s.messages.c.assignment).toBe('revisar')
    expect(reviewQueue(s).map((m) => m.id)).toEqual(['c'])
  })

  it('files a new identifier into the chat case unless it contradicts it', () => {
    const s = run([
      [msg('a', 'p-paola', '09:00'), cls('mensaje', { numero: 'N-1' })],
      [msg('b', 'p-paola', '09:05'), cls('poliza', { poliza: 'P-1' })],
      [msg('c', 'p-paola', '09:10'), cls('mensaje', { numero: 'N-2' })],
    ])
    expect(s.messages.b.expedienteId).toBe(s.messages.a.expedienteId)
    expect(s.messages.c.expedienteId).not.toBe(s.messages.a.expedienteId)
    expect(s.expedienteOrder).toHaveLength(2)
  })

  it('keeps a private chat on its case for hours', () => {
    const s = run([
      [msg('a', 'p-paola', '09:00'), cls('mensaje', { numero: 'N-1' })],
      [msg('b', 'p-paola', '13:00', { attachment: { type: 'photo' } }), cls('foto')],
    ])
    expect(s.messages.b.assignment).toBe('contexto')
  })

  it('adopts earlier orphans from the same chat when a case opens there', () => {
    const s = run([
      [msg('a', 'p-fernando', '09:52'), cls('mensaje', {}, { ubicacion: 'Lázaro Cárdenas' })],
      [msg('b', 'p-fernando', '09:53'), cls('poliza', { poliza: 'AXA-1' })],
    ])
    const exp = s.expedientes[s.expedienteOrder[0]]
    expect(exp.items.sort()).toEqual(['a', 'b'])
    expect(exp.ubicacion).toBe('Lázaro Cárdenas')
    expect(reviewQueue(s)).toHaveLength(0)
  })

  it('matches by asegurado only when exactly one case fits', () => {
    const s = run([
      [msg('a', 'p-fernando', '09:00'), cls('poliza', { poliza: 'AXA-1' }, { asegurado: 'Fernando Ríos', vehiculo: 'Kia Rio 2020' })],
      [msg('b', 'g-ajustadores', '10:00'), cls('mensaje', { numero: '7712' }, { asegurado: 'Fernando Rios' })],
    ])
    expect(s.expedienteOrder).toHaveLength(1)
    expect(s.expedientes[s.expedienteOrder[0]].numero).toBe('7712')
  })

  it('ignores chit-chat', () => {
    const s = run([[msg('a', 'g-ajustadores', '09:00'), cls('mensaje', {}, {}, { relevant: false })]])
    expect(s.messages.a.assignment).toBe('irrelevante')
    expect(s.expedienteOrder).toHaveLength(0)
  })

  it('trusts a backend matchId only when the expediente exists', () => {
    let s = run([[msg('a', 'p-jorge', '09:00'), cls('mensaje', { numero: 'N-1' })]])
    s = reducer(s, { type: 'receive', message: msg('b', 'g-ajustadores', '11:00') })
    s = reducer(s, { type: 'classified', messageId: 'b', classification: cls('mensaje', {}, {}, { matchId: 'exp-99' }) })
    expect(s.messages.b.assignment).toBe('revisar')
    s = reducer(s, { type: 'receive', message: msg('c', 'g-ajustadores', '11:01') })
    s = reducer(s, { type: 'classified', messageId: 'c', classification: cls('mensaje', {}, {}, { matchId: 'exp-1' }) })
    expect(s.messages.c.expedienteId).toBe('exp-1')
  })

  it('moves an item between cases on manual assignment', () => {
    let s = run([
      [msg('a', 'p-jorge', '09:00'), cls('mensaje', { numero: 'N-1' })],
      [msg('b', 'p-paola', '09:00'), cls('mensaje', { numero: 'N-2' })],
      [msg('c', 'p-jorge', '09:05', { attachment: { type: 'photo' } }), cls('foto')],
    ])
    const [n2, n1] = s.expedienteOrder
    s = reducer(s, { type: 'assign', messageId: 'c', expedienteId: n2 })
    expect(s.expedientes[n1].items).toEqual(['a'])
    expect(s.expedientes[n2].items).toEqual(['b', 'c'])
    expect(s.messages.c.assignment).toBe('manual')
  })
})

describe('the scripted morning', () => {
  const sc = scenarioFor(new Date(2026, 8, 24))
  let s = reducer(emptyState(), { type: 'chats', chats: CHATS })
  for (const m of [...sc.history, ...sc.live]) {
    const { cls: c, ...message } = m
    s = reducer(s, { type: 'receive', message })
    s = reducer(s, { type: 'classified', messageId: m.id, classification: c })
  }
  const byNumero = (n) => Object.values(s.expedientes).find((e) => e.numero === n)

  it('ends with five expedientes and one photo to review', () => {
    expect(s.expedienteOrder).toHaveLength(5)
    const queue = reviewQueue(s)
    expect(queue).toHaveLength(1)
    expect(queue[0].sender).toBe('Luis Ortega')
  })

  it('merges the Kia Rio póliza and the later AXA number into one case', () => {
    const e = byNumero('7712-2026-004518')
    expect(e.poliza).toBe('38-UJ-291845')
    expect(e.aseguradora).toBe('AXA')
    expect(e.ajustador).toBe('Mariana Cantú')
    // The asegurado's first text, sent before the póliza, was adopted.
    const first = sc.live.find((m) => m.sender === 'Fernando Ríos')
    expect(e.items).toContain(first.id)
  })

  it('files Jorge’s group photos in the Versa case by vehicle', () => {
    const e = byNumero('04-2291834')
    const photos = e.items.filter((id) => s.messages[id].attachment?.type === 'photo')
    expect(photos).toHaveLength(4)
    expect(e.poliza).toBe('5100-448120-03')
    // Only the póliza document is still missing.
    expect(pendientes(s, e).map((p) => p.key)).toEqual(['doc:poliza'])
  })

  it('fills the Hilux case from the póliza, the reply and the taller', () => {
    const e = byNumero('26-0918-77412')
    expect(e.ajustador).toBe('Mariana Cantú')
    expect(e.monto).toBe('$52,380 MXN')
    expect(e.placas).toBe('RKT-318-B')
    expect(statusOf(s, e)).toBe('integracion')
  })

  it('marks the CR-V case complete', () => {
    expect(pendientes(s, byNumero('04-2290115'))).toEqual([])
    expect(statusOf(s, byNumero('04-2290115'))).toBe('completo')
  })

  it('searches by aseguradora, póliza, placas and date', () => {
    expect(searchExpedientes(s, { aseguradora: 'Qualitas' })).toHaveLength(2)
    expect(searchExpedientes(s, { q: 'aut-7730192' })[0].numero).toBe('26-0918-77412')
    expect(searchExpedientes(s, { q: 'pxl452c' })[0].numero).toBe('04-2291834')
    expect(searchExpedientes(s, { desde: '2026-09-24' })).toHaveLength(3)
  })
})

describe('scenarioFor', () => {
  it('shifts every date so the live morning is today', () => {
    const sc = scenarioFor(new Date(2026, 10, 3))
    expect(sc.today).toBe('2026-11-03')
    expect(sc.live[0].at.startsWith('2026-11-03')).toBe(true)
    expect(sc.history[0].at.startsWith('2026-10-29')).toBe(true)
    const photo = sc.live.find((m) => m.attachment?.type === 'photo')
    expect(photo.attachment.name).toMatch(/^IMG-20261103-/)
    expect(photo.attachment.photo.stamp).toMatch(/^03\/11\/2026/)
  })
})
