import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheck,
  Download,
  FileArchive,
  FileText,
  Image as ImageIcon,
  Inbox,
  Loader,
  MessageSquare,
  Search,
  X,
} from 'lucide-react'
import {
  DOC_KIND_LABELS,
  FIELD_LABELS,
  MANUAL_STATUSES,
  STATUS_LABELS,
  expTitle,
  itemsOf,
  pendientes,
  reviewQueue,
  searchExpedientes,
  statusOf,
} from './engine'
import { INSURERS } from './localClassify'
import { buildZip } from './files'
import { blobOf, openDoc, saveBlob } from './api'
import { srcOf } from './media'

const fmtDate = (d) => (d ? d.split('-').reverse().join('/') : '')
const fmtAt = (iso) => `${fmtDate(iso.slice(0, 10)).slice(0, 5)} ${iso.slice(11, 16)}`

const HOW_LABELS = {
  identificador: 'por identificador',
  contexto: 'por contexto de la conversación',
  nuevo: 'abrió el expediente',
  manual: 'asignado a mano',
}

const folderOf = (exp) => `Siniestro_${(exp.numero ?? exp.poliza ?? exp.id).replace(/[^A-Za-z0-9-]/g, '')}`

async function zipEntries(messages, prefix) {
  const used = new Set()
  const out = []
  for (const m of messages) {
    const att = m.attachment
    let name = att.name
    for (let n = 2; used.has(name); n++) name = att.name.replace(/(\.[^.]+)?$/, ` (${n})$1`)
    used.add(name)
    const blob = await blobOf(att)
    out.push({ name: `${prefix}${name}`, data: new Uint8Array(await blob.arrayBuffer()), date: new Date(m.at) })
  }
  return out
}

function summaryText(state, exp, chats) {
  const lines = [`Expediente ${expTitle(exp)}`, `Estatus: ${STATUS_LABELS[statusOf(state, exp)]}`, '']
  for (const [key, label] of Object.entries(FIELD_LABELS)) lines.push(`${label}: ${exp[key] ?? '(pendiente)'}`)
  const missing = pendientes(state, exp)
  lines.push('', 'Pendientes:', ...(missing.length ? missing.map((p) => `- ${p.label}`) : ['- Ninguno']))
  lines.push('', 'Actividad:')
  for (const m of itemsOf(state, exp).all) {
    const what = m.attachment ? m.attachment.name : m.text
    lines.push(`${fmtAt(m.at)}  ${m.sender} (${chats[m.chatId]?.name}): ${what}`)
  }
  return lines.join('\r\n')
}

function useZip() {
  const [busy, setBusy] = useState(null)
  const run = async (key, build) => {
    setBusy(key)
    try {
      const { entries, name } = await build()
      saveBlob(new Blob([buildZip(entries)], { type: 'application/zip' }), name)
    } finally {
      setBusy(null)
    }
  }
  return [busy, run]
}

function StatusPill({ status }) {
  return <span className={`sin-status sin-status--${status}`}>{STATUS_LABELS[status]}</span>
}

// ---- list -------------------------------------------------------------------

function ExpedienteList({ state, flash, onOpen }) {
  const [filters, setFilters] = useState({ q: '', aseguradora: '', estatus: '', desde: '', hasta: '' })
  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }))
  const rows = searchExpedientes(state, filters)
  const insurers = [...new Set([...INSURERS.slice(0, 5), ...state.expedienteOrder.map((id) => state.expedientes[id].aseguradora).filter(Boolean)])]
  return (
    <div className="sin-list">
      <div className="sin-filters">
        <label className="sin-search">
          <Search size={16} />
          <input value={filters.q} onChange={set('q')} placeholder="Buscar siniestro, póliza, placas, asegurado…" />
        </label>
        <select value={filters.aseguradora} onChange={set('aseguradora')} aria-label="Aseguradora">
          <option value="">Todas las aseguradoras</option>
          {insurers.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
        <select value={filters.estatus} onChange={set('estatus')} aria-label="Estatus">
          <option value="">Todos los estatus</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <label className="sin-date">
          Desde <input type="date" value={filters.desde} onChange={set('desde')} />
        </label>
        <label className="sin-date">
          Hasta <input type="date" value={filters.hasta} onChange={set('hasta')} />
        </label>
      </div>
      <div className="sin-table" role="table">
        <div className="sin-tr sin-th" role="row">
          <span>Siniestro</span>
          <span>Aseguradora</span>
          <span>Asegurado · Vehículo</span>
          <span>Fecha</span>
          <span>Material</span>
          <span>Pendientes</span>
          <span>Estatus</span>
        </div>
        {rows.length === 0 && <div className="sin-empty">Sin expedientes con esos filtros.</div>}
        {rows.map((exp) => {
          const { photos, docs } = itemsOf(state, exp)
          const missing = pendientes(state, exp)
          return (
            <button
              key={`${exp.id}-${flash[exp.id] ?? 0}`}
              className={`sin-tr ${flash[exp.id] ? 'sin-flash' : ''}`}
              role="row"
              onClick={() => onOpen(exp.id)}
            >
              <span className="sin-mono">
                <strong>{expTitle(exp)}</strong>
                {exp.placas && <small>{exp.placas}</small>}
              </span>
              <span>{exp.aseguradora ?? <em>Por identificar</em>}</span>
              <span className="sin-two">
                <span>{exp.asegurado ?? '—'}</span>
                <small>{exp.vehiculo ?? ''}</small>
              </span>
              <span>{fmtDate(exp.fecha) || '—'}</span>
              <span className="sin-counts">
                <ImageIcon size={14} /> {photos.length}
                <FileText size={14} /> {docs.length}
              </span>
              <span>{missing.length ? <span className="sin-missing">{missing.length}</span> : <CircleCheck size={16} className="sin-ok" />}</span>
              <span>
                <StatusPill status={statusOf(state, exp)} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---- review queue -------------------------------------------------------------

function Preview({ message, onPhoto }) {
  const att = message.attachment
  if (att?.type === 'photo') {
    return (
      <button className="sin-thumb" onClick={onPhoto}>
        <img src={srcOf(att)} alt={att.name} />
      </button>
    )
  }
  if (att?.type === 'doc') {
    return (
      <button className="sin-docthumb" onClick={() => openDoc(att)}>
        <FileText size={28} />
      </button>
    )
  }
  return (
    <span className="sin-docthumb">
      <MessageSquare size={24} />
    </span>
  )
}

function ReviewQueue({ state, dispatch, onPhoto }) {
  const queue = reviewQueue(state)
  const [choice, setChoice] = useState({})
  if (!queue.length) {
    return (
      <div className="sin-empty sin-empty--big">
        <Inbox size={28} />
        Nada por revisar. Todo lo que llegó ya está en su expediente.
      </div>
    )
  }
  return (
    <div className="sin-review">
      <p className="sin-hint">
        Mensajes sin número, póliza, placas ni contexto suficiente para asignarlos solos. Un clic y quedan en su expediente.
      </p>
      {queue.map((m) => (
        <div className="sin-review-card" key={m.id}>
          <Preview message={m} onPhoto={() => onPhoto([m], 0)} />
          <div className="sin-review-body">
            <div className="sin-review-meta">
              {m.sender} · {state.chats[m.chatId]?.name} · {fmtAt(m.at)}
            </div>
            <div className="sin-review-summary">{m.classification?.summary || m.text || m.attachment?.name}</div>
            <div className="sin-review-actions">
              <select value={choice[m.id] ?? ''} onChange={(e) => setChoice((c) => ({ ...c, [m.id]: e.target.value }))}>
                <option value="">Elegir expediente…</option>
                {state.expedienteOrder.map((id) => {
                  const e = state.expedientes[id]
                  return (
                    <option key={id} value={id}>
                      {expTitle(e)} · {e.vehiculo ?? e.asegurado ?? ''}
                    </option>
                  )
                })}
                <option value="new">+ Crear expediente nuevo</option>
              </select>
              <button
                className="sin-btn"
                disabled={!choice[m.id]}
                onClick={() => dispatch({ type: 'assign', messageId: m.id, expedienteId: choice[m.id] })}
              >
                Asignar
              </button>
              <button className="sin-btn sin-btn--ghost" onClick={() => dispatch({ type: 'discard', messageId: m.id })}>
                Descartar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- detail -------------------------------------------------------------------

function ExpedienteDetail({ state, exp, dispatch, onBack, onPhoto }) {
  const { all, photos, docs } = itemsOf(state, exp)
  const missing = pendientes(state, exp)
  const status = statusOf(state, exp)
  const derived = statusOf(state, { ...exp, manualStatus: null })
  const [busy, runZip] = useZip()
  const sourceOf = (key) => {
    const m = state.messages[exp.sources[key]]
    if (!m) return null
    return `${m.attachment?.type === 'doc' ? m.attachment.name : 'mensaje'} · ${m.sender.split(' · ')[0]}`
  }

  return (
    <div className="sin-detail">
      <div className="sin-detail-head">
        <button className="sin-btn sin-btn--ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Expedientes
        </button>
        <div className="sin-detail-title">
          <h2>{expTitle(exp)}</h2>
          <span>
            {[exp.aseguradora, exp.asegurado, exp.vehiculo].filter(Boolean).join(' · ')}
          </span>
        </div>
        <div className="sin-detail-actions">
          <select
            value={exp.manualStatus ?? ''}
            onChange={(e) => dispatch({ type: 'status', expedienteId: exp.id, status: e.target.value })}
            aria-label="Estatus"
          >
            <option value="">Automático: {STATUS_LABELS[derived]}</option>
            {Object.entries(MANUAL_STATUSES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <button
            className="sin-btn"
            disabled={busy != null}
            onClick={() =>
              runZip('all', async () => {
                const folder = folderOf(exp)
                const entries = [
                  ...(await zipEntries(photos, `${folder}/fotos/`)),
                  ...(await zipEntries(docs, `${folder}/documentos/`)),
                  { name: `${folder}/resumen.txt`, data: new TextEncoder().encode(summaryText(state, exp, state.chats)) },
                ]
                return { entries, name: `${folder}.zip` }
              })
            }
          >
            {busy === 'all' ? <Loader size={16} className="sin-spin" /> : <FileArchive size={16} />} Descargar expediente
          </button>
        </div>
      </div>

      <div className="sin-detail-grid">
        <section className="sin-card">
          <h3>
            Datos del siniestro <StatusPill status={status} />
          </h3>
          <dl className="sin-fields">
            {Object.entries(FIELD_LABELS).map(([key, label]) => (
              <div key={key} className={exp[key] ? '' : 'sin-field--empty'}>
                <dt>{label}</dt>
                <dd>
                  {exp[key] ? (key === 'fecha' ? fmtDate(exp[key]) : exp[key]) : 'Pendiente'}
                  {exp[key] && sourceOf(key) && <small>de {sourceOf(key)}</small>}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="sin-card">
          <h3>Pendientes por completar</h3>
          {missing.length === 0 ? (
            <p className="sin-complete">
              <CircleCheck size={18} /> Expediente completo, listo para enviar a la aseguradora.
            </p>
          ) : (
            <ul className="sin-checklist">
              {missing.map((p) => (
                <li key={p.key}>
                  <Circle size={14} /> {p.label}
                </li>
              ))}
            </ul>
          )}
          <h3 className="sin-mt">Documentos ({docs.length})</h3>
          {docs.length === 0 && <p className="sin-muted">Aún no llega ningún documento.</p>}
          <ul className="sin-docs">
            {docs.map((m) => (
              <li key={m.id}>
                <FileText size={18} />
                <span className="sin-doc-body">
                  <button className="sin-link" onClick={() => openDoc(m.attachment)}>
                    {m.attachment.name}
                  </button>
                  <small>
                    {DOC_KIND_LABELS[m.classification?.kind] ?? 'Documento'} · {m.sender.split(' · ')[0]} · {fmtAt(m.at)}
                  </small>
                </span>
                <button
                  className="sin-icon"
                  onClick={async () => saveBlob(await blobOf(m.attachment), m.attachment.name)}
                  aria-label={`Descargar ${m.attachment.name}`}
                >
                  <Download size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="sin-card sin-card--wide">
          <h3>
            Fotos ({photos.length})
            {photos.length > 0 && (
              <button
                className="sin-btn sin-btn--small"
                disabled={busy != null}
                onClick={() =>
                  runZip('photos', async () => ({
                    entries: await zipEntries(photos, `${folderOf(exp)}_fotos/`),
                    name: `${folderOf(exp)}_fotos.zip`,
                  }))
                }
              >
                {busy === 'photos' ? <Loader size={14} className="sin-spin" /> : <FileArchive size={14} />} Descargar todas (ZIP)
              </button>
            )}
          </h3>
          {photos.length === 0 && <p className="sin-muted">Aún no llegan fotos.</p>}
          <div className="sin-photos">
            {photos.map((m, i) => (
              <figure key={m.id}>
                <button className="sin-photo" onClick={() => onPhoto(photos, i)}>
                  <img src={srcOf(m.attachment)} alt={m.classification?.summary ?? m.attachment.name} />
                </button>
                <figcaption>
                  <span>{m.sender.split(' · ')[0]} · {fmtAt(m.at)}</span>
                  <button
                    className="sin-icon"
                    onClick={async () => saveBlob(await blobOf(m.attachment), m.attachment.name)}
                    aria-label={`Descargar ${m.attachment.name}`}
                  >
                    <Download size={14} />
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="sin-card sin-card--wide">
          <h3>Actividad</h3>
          <ol className="sin-timeline">
            {all.map((m) => (
              <li key={m.id}>
                <span className="sin-tl-time">{fmtAt(m.at)}</span>
                <span className="sin-tl-body">
                  <span>
                    <strong>{m.sender}</strong> en <em>{state.chats[m.chatId]?.name}</em>
                  </span>
                  <span className="sin-tl-what">
                    {m.attachment?.type === 'photo' ? <ImageIcon size={14} /> : m.attachment ? <FileText size={14} /> : <MessageSquare size={14} />}
                    {m.classification?.summary || m.text || m.attachment?.name}
                  </span>
                  <small>
                    {HOW_LABELS[m.assignment]}
                    {m.classification?.source === 'local' ? ' · reglas locales' : ''}
                  </small>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

function Lightbox({ photos, index, onClose, onMove }) {
  const m = photos[index]
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onMove])
  if (!m) return null
  return (
    <div className="sin-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="sin-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <img src={srcOf(m.attachment)} alt={m.attachment.name} />
        <div className="sin-lightbox-bar">
          <span>
            {m.attachment.name} · {m.sender} · {fmtAt(m.at)}
          </span>
          <span className="sin-lightbox-actions">
            {photos.length > 1 && (
              <>
                <button className="sin-icon" onClick={() => onMove(-1)} aria-label="Anterior">
                  <ChevronLeft size={18} />
                </button>
                <button className="sin-icon" onClick={() => onMove(1)} aria-label="Siguiente">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            <button className="sin-btn sin-btn--small" onClick={async () => saveBlob(await blobOf(m.attachment), m.attachment.name)}>
              <Download size={14} /> Descargar original
            </button>
            <button className="sin-icon" onClick={onClose} aria-label="Cerrar">
              <X size={18} />
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Platform({ state, dispatch, flash, openExpId, onOpenExp }) {
  const [tab, setTab] = useState('list')
  const [lightbox, setLightbox] = useState(null)
  const queue = reviewQueue(state)
  const exp = openExpId ? state.expedientes[openExpId] : null
  const onPhoto = (photos, index) => setLightbox({ photos, index })
  const move = useMemo(
    () => (d) => setLightbox((lb) => lb && { ...lb, index: (lb.index + d + lb.photos.length) % lb.photos.length }),
    [],
  )
  const close = useMemo(() => () => setLightbox(null), [])

  return (
    <div className="sin-platform">
      {exp ? (
        <ExpedienteDetail state={state} exp={exp} dispatch={dispatch} onBack={() => onOpenExp(null)} onPhoto={onPhoto} />
      ) : (
        <>
          <div className="sin-tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'list'} className={tab === 'list' ? 'is-active' : ''} onClick={() => setTab('list')}>
              Expedientes <span>{state.expedienteOrder.length}</span>
            </button>
            <button role="tab" aria-selected={tab === 'review'} className={tab === 'review' ? 'is-active' : ''} onClick={() => setTab('review')}>
              Por revisar <span className={queue.length ? 'sin-tab-alert' : ''}>{queue.length}</span>
            </button>
          </div>
          {tab === 'list' ? (
            <ExpedienteList state={state} flash={flash} onOpen={onOpenExp} />
          ) : (
            <ReviewQueue state={state} dispatch={dispatch} onPhoto={onPhoto} />
          )}
        </>
      )}
      {lightbox && <Lightbox photos={lightbox.photos} index={lightbox.index} onClose={close} onMove={move} />}
    </div>
  )
}
