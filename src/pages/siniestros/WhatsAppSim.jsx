import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, CheckCheck, FileText, Loader, Paperclip, Plus, SendHorizontal, Users } from 'lucide-react'
import { OWN_NUMBER } from './scenario'
import { srcOf } from './media'

const time = (iso) => iso.slice(11, 16)
const dayOf = (today) => (iso) => {
  const d = iso.slice(0, 10)
  return d === today ? 'Hoy' : d.split('-').reverse().slice(0, 2).join('/')
}

function Avatar({ chat }) {
  const initials = chat.name
    .split(/\s+/)
    .filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return <span className={`wa-avatar ${chat.isGroup ? 'wa-avatar--group' : ''}`}>{chat.isGroup ? <Users size={18} /> : initials}</span>
}

function Tag({ message, expedientes }) {
  if (message.status === 'processing') {
    return (
      <span className="wa-tag wa-tag--busy">
        <Loader size={11} className="sin-spin" /> Procesando
      </span>
    )
  }
  if (message.assignment === 'revisar') return <span className="wa-tag wa-tag--review">Por revisar</span>
  if (!message.expedienteId) return null
  const exp = expedientes[message.expedienteId]
  return <span className="wa-tag">{exp?.numero ?? exp?.poliza ?? 'Expediente nuevo'}</span>
}

function Bubble({ message, expedientes, chat }) {
  const att = message.attachment
  return (
    <div className={`wa-row ${message.outgoing ? 'wa-row--out' : ''}`}>
      <div className={`wa-bubble ${message.outgoing ? 'wa-bubble--out' : ''} ${att?.type === 'photo' ? 'wa-bubble--photo' : ''}`}>
        {chat.isGroup && !message.outgoing && <div className="wa-sender">{message.sender}</div>}
        {att?.type === 'photo' && <img className="wa-photo" src={srcOf(att)} alt={att.name} />}
        {att?.type === 'doc' && (
          <div className="wa-doc">
            <FileText size={22} />
            <span>
              <strong>{att.name}</strong>
              <small>PDF</small>
            </span>
          </div>
        )}
        {message.text && <div className="wa-text">{message.text}</div>}
        <div className="wa-meta">
          {time(message.at)}
          {message.outgoing && <CheckCheck size={14} className="wa-ticks" />}
        </div>
      </div>
      {!message.outgoing || message.classification?.relevant ? (
        <Tag message={message} expedientes={expedientes} />
      ) : null}
    </div>
  )
}

function ChatList({ state, day, onOpen, onNewChat }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const lastOf = (chatId) => {
    for (let i = state.messageOrder.length - 1; i >= 0; i--) {
      const m = state.messages[state.messageOrder[i]]
      if (m.chatId === chatId) return m
    }
    return null
  }
  return (
    <div className="wa-list">
      {state.chatOrder.map((id) => {
        const chat = state.chats[id]
        const last = lastOf(id)
        const preview = last ? (last.text || (last.attachment?.type === 'photo' ? 'Foto' : last.attachment?.name)) : chat.members ?? chat.subtitle
        return (
          <button key={id} className="wa-list-item" onClick={() => onOpen(id)}>
            <Avatar chat={chat} />
            <span className="wa-list-body">
              <span className="wa-list-top">
                <strong>{chat.name}</strong>
                {last && <small className={chat.unread ? 'wa-unread-time' : ''}>{day(last.at) === 'Hoy' ? time(last.at) : day(last.at)}</small>}
              </span>
              <span className="wa-list-bottom">
                <span className="wa-preview">
                  {chat.isGroup && last && !last.outgoing ? `${last.sender.split(' ')[0]}: ` : ''}
                  {preview}
                </span>
                {chat.unread > 0 && <span className="wa-badge">{chat.unread}</span>}
              </span>
            </span>
          </button>
        )
      })}
      {adding ? (
        <form
          className="wa-newchat"
          onSubmit={(e) => {
            e.preventDefault()
            if (name.trim()) onNewChat(name.trim())
            setName('')
            setAdding(false)
          }}
        >
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del contacto" />
          <button type="submit">Agregar</button>
        </form>
      ) : (
        <button className="wa-fab" onClick={() => setAdding(true)} aria-label="Nuevo chat">
          <Plus size={20} />
        </button>
      )}
    </div>
  )
}

function Composer({ chat, onSend }) {
  const members = useMemo(() => {
    if (!chat.isGroup) return [chat.name, 'Tú']
    const names = (chat.members ?? '').split(',').map((s) => s.trim()).filter((s) => s && s !== 'tú')
    return [...names, 'Tú']
  }, [chat])
  const [sender, setSender] = useState(members[0])
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  const send = (e) => {
    e.preventDefault()
    if (!text.trim() && !file) return
    onSend({ sender, text: text.trim(), file })
    setText('')
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <form className="wa-composer" onSubmit={send}>
      <label className="wa-as">
        Enviar como
        <select value={sender} onChange={(e) => setSender(e.target.value)}>
          {members.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </label>
      {file && (
        <div className="wa-pending-file">
          <Paperclip size={13} /> {file.name}
          <button type="button" onClick={() => setFile(null)} aria-label="Quitar archivo">
            ×
          </button>
        </div>
      )}
      <div className="wa-compose-row">
        <button type="button" className="wa-icon-btn" onClick={() => inputRef.current?.click()} aria-label="Adjuntar foto o PDF">
          <Paperclip size={20} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <input className="wa-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Mensaje" />
        <button type="submit" className="wa-send" aria-label="Enviar" disabled={!text.trim() && !file}>
          <SendHorizontal size={18} />
        </button>
      </div>
    </form>
  )
}

export default function WhatsAppSim({ state, today, openChatId, onOpenChat, onSend, onNewChat }) {
  const day = useMemo(() => dayOf(today), [today])
  const chat = openChatId ? state.chats[openChatId] : null
  const messages = useMemo(
    () => (chat ? state.messageOrder.map((id) => state.messages[id]).filter((m) => m.chatId === chat.id) : []),
    [chat, state.messageOrder, state.messages],
  )
  const scrollRef = useRef(null)
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, openChatId])

  return (
    <div className="wa-phone">
      <div className="wa-statusbar">
        <span>9:41</span>
        <span>WhatsApp Business · {OWN_NUMBER}</span>
      </div>
      {chat ? (
        <>
          <header className="wa-header">
            <button className="wa-icon-btn wa-back" onClick={() => onOpenChat(null)} aria-label="Volver">
              <ArrowLeft size={20} />
            </button>
            <Avatar chat={chat} />
            <span className="wa-header-title">
              <strong>{chat.name}</strong>
              <small>{chat.isGroup ? chat.members : chat.subtitle}</small>
            </span>
          </header>
          <div className="wa-thread" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={m.id}>
                {(i === 0 || day(messages[i - 1].at) !== day(m.at)) && <div className="wa-day">{day(m.at)}</div>}
                <Bubble message={m} expedientes={state.expedientes} chat={chat} />
              </div>
            ))}
          </div>
          <Composer key={chat.id} chat={chat} onSend={(msg) => onSend(chat.id, msg)} />
        </>
      ) : (
        <>
          <header className="wa-header wa-header--home">
            <strong>Chats</strong>
          </header>
          <ChatList state={state} day={day} onOpen={onOpenChat} onNewChat={onNewChat} />
        </>
      )}
    </div>
  )
}
