import { useEffect, useState, useSyncExternalStore } from 'react'
import { useLanguage } from '../i18n/useLanguage'
import { ROUTES } from '../i18n/copy'
import { bookSlot, cancelBooking, moveBooking, openSlots, viewBooking } from './scheduleApi'
import SlotPicker from './SlotPicker'
import {
  dayLabel,
  timeLabel,
  zoneLabel,
  localDateKey,
  subscribeNever,
  getServerZone,
} from './scheduleFormat'
import './Schedule.css'

// Booking page. Every instant comes from the server already computed; this
// page only formats them for display. No slot arithmetic lives here on
// purpose: the landing repo has no test runner, so the date logic stays in
// demo-backend where it is covered.

// The move route returns a fresh manageUrl (new slot, re-signed): pull the
// b/s query params back out of it so a following cancel or move still
// authorizes against the booking's current slot.
function parseManageUrl(url) {
  const params = new URL(url).searchParams
  return { b: params.get('b'), s: params.get('s') }
}

// If the day currently selected has no slots left in a freshly-fetched list
// (e.g. the last time on it just got taken), fall back to the first day that
// still has any, so the grid never shows a highlighted day with nothing
// under it.
function reconcileDay(prevDay, freshSlots) {
  if (prevDay && freshSlots.some((s) => localDateKey(s) === prevDay)) return prevDay
  return freshSlots.length ? localDateKey(freshSlots[0]) : null
}

function Schedule() {
  const { lang, copy } = useLanguage()
  const c = copy.schedule
  const locale = lang === 'es' ? 'es-MX' : 'en-US'

  const [slots, setSlots] = useState([])
  const [day, setDay] = useState(null)
  const [picked, setPicked] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', website: '', note: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  // The visitor's zone abbreviation. Read via useSyncExternalStore, not at
  // render time directly and not via setState-in-an-effect: read directly
  // during render it would run on the server too, and the prerendered HTML
  // would carry the *build machine's* zone rather than the visitor's, plus
  // mismatch what the client renders on hydration. getServerZone ('') is
  // used for the server render and the client's first, hydration-matching
  // render; zoneLabel() takes over immediately after.
  const zone = useSyncExternalStore(subscribeNever, zoneLabel, getServerZone)

  // A manage link (?b=&s=) turns this into the booking's own page. Kept in
  // state, not a one-shot memo, because a successful move re-signs the
  // booking and replaces b/s here (see parseManageUrl).
  const [manage, setManage] = useState(() => {
    if (typeof window === 'undefined') return null
    const q = new URLSearchParams(window.location.search)
    const b = q.get('b')
    const s = q.get('s')
    return b && s ? { b, s } : null
  })
  const [managing, setManaging] = useState(null)
  const [cancelled, setCancelled] = useState(false)

  // The manage view's own reschedule picker: a separate slot list and
  // selection so it never collides with the booking view's.
  const [moving, setMoving] = useState(false)
  const [moveSlots, setMoveSlots] = useState([])
  const [moveDay, setMoveDay] = useState(null)
  const [movePicked, setMovePicked] = useState(null)

  useEffect(() => {
    if (manage) {
      viewBooking(manage.b, manage.s)
        .then(setManaging)
        .catch((err) => setError(c.errors[err.message] ?? c.errors.generic))
      return
    }
    openSlots()
      .then((data) => {
        setSlots(data.slots)
        setDay(data.slots.length ? localDateKey(data.slots[0]) : null)
      })
      .catch(() => setError(c.errors.generic))
  }, [manage, c.errors])

  function selectDay(d) {
    setDay(d)
    setPicked(null)
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await bookSlot({ ...form, slotStartUtc: picked, lang })
      window.location.href = ROUTES[lang].thanks
    } catch (err) {
      setError(c.errors[err.message] ?? c.errors.generic)
      // A taken slot means the grid is stale: refresh it.
      if (err.message === 'slot_taken') {
        openSlots()
          .then((data) => {
            setSlots(data.slots)
            setDay((prevDay) => reconcileDay(prevDay, data.slots))
          })
          .catch(() => {})
        setPicked(null)
      }
      setBusy(false)
    }
  }

  async function doCancel() {
    setBusy(true)
    setError(null)
    try {
      await cancelBooking(manage.b, manage.s)
      setCancelled(true)
    } catch (err) {
      setError(c.errors[err.message] ?? c.errors.generic)
    }
    setBusy(false)
  }

  // Reveals the reschedule picker, loading a fresh slot list for it (the one
  // the booking view fetched, if any, was never fetched on the manage page).
  function openMove() {
    setError(null)
    setBusy(true)
    openSlots()
      .then((data) => {
        setMoveSlots(data.slots)
        setMoveDay(data.slots.length ? localDateKey(data.slots[0]) : null)
        setMovePicked(null)
        setMoving(true)
      })
      .catch(() => setError(c.errors.generic))
      .finally(() => setBusy(false))
  }

  function selectMoveDay(d) {
    setMoveDay(d)
    setMovePicked(null)
  }

  async function confirmMove() {
    if (!movePicked) return
    setBusy(true)
    setError(null)
    try {
      const result = await moveBooking(manage.b, manage.s, movePicked)
      const fresh = parseManageUrl(result.manageUrl)
      setManage(fresh)
      // Keep the address bar in sync with the re-signed link: a refresh or a
      // bookmark taken right after this must still authorize, not 404 against
      // the now-deleted old slot. Safe unguarded here, this only ever runs
      // inside a click handler, never during the server render.
      const qs = new URLSearchParams({ b: fresh.b, s: fresh.s }).toString()
      window.history.replaceState(null, '', `${window.location.pathname}?${qs}`)
      setManaging((prev) => ({ ...prev, slotStartUtc: result.slotStartUtc }))
      setMoving(false)
      setMovePicked(null)
    } catch (err) {
      setError(c.errors[err.message] ?? c.errors.generic)
      // A taken slot means the grid is stale: refresh it.
      if (err.message === 'slot_taken') {
        openSlots()
          .then((data) => {
            setMoveSlots(data.slots)
            setMoveDay((prevDay) => reconcileDay(prevDay, data.slots))
          })
          .catch(() => {})
        setMovePicked(null)
      }
    }
    setBusy(false)
  }

  if (manage) {
    return (
      <section className="schedule-page">
        <div className="schedule-inner schedule-narrow">
          <h1>{c.manageTitle}</h1>
          {cancelled && <p className="schedule-ok">{c.cancelled}</p>}
          {error && (
            <p className="schedule-error" role="alert">
              {error}
            </p>
          )}
          {managing && !cancelled && (
            <>
              <p className="schedule-when">
                {dayLabel(managing.slotStartUtc, locale)}, {timeLabel(managing.slotStartUtc, locale)}
                {zone ? ` ${zone}` : ''}
              </p>

              <div className="schedule-actions">
                {/* Hidden rather than removed once moving is true would put a
                    second "move" label on screen at once (the picker's own
                    confirm button); Cancel stays reachable the whole time so
                    changing your mind mid-reschedule never requires a reload. */}
                {!moving && (
                  <button className="schedule-btn" onClick={openMove} disabled={busy}>
                    {c.move}
                  </button>
                )}
                <button className="schedule-btn schedule-btn-quiet" onClick={doCancel} disabled={busy}>
                  {c.cancel}
                </button>
              </div>

              {moving && (
                <div className="schedule-move">
                  <SlotPicker
                    slots={moveSlots}
                    day={moveDay}
                    onDayChange={selectMoveDay}
                    picked={movePicked}
                    onPick={setMovePicked}
                    locale={locale}
                    zone={zone}
                    c={c}
                  />
                  {movePicked && (
                    <button className="schedule-btn" onClick={confirmMove} disabled={busy}>
                      {c.move}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="schedule-page">
      <div className="schedule-inner">
        <div className="schedule-copy">
          <h1>{c.title}</h1>
          <p className="schedule-intro">{c.intro}</p>
          <ul className="schedule-bullets">
            {c.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>

        <div className="schedule-picker">
          {error && (
            <p className="schedule-error" role="alert">
              {error}
            </p>
          )}

          <SlotPicker
            slots={slots}
            day={day}
            onDayChange={selectDay}
            picked={picked}
            onPick={setPicked}
            locale={locale}
            zone={zone}
            c={c}
          />

          {picked && (
            <form className="schedule-form" onSubmit={submit}>
              <label>
                {c.form.name}
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                {c.form.email}
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label>
                {c.form.website}
                <input
                  required
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </label>
              <label>
                {c.form.note}
                <textarea
                  rows="2"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </label>
              <button className="schedule-btn" disabled={busy}>
                {busy ? c.booking : c.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default Schedule
