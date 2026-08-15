import { useMemo } from 'react'
import { dayLabel, timeLabel, localDateKey } from './scheduleFormat'

// Day-and-time grid shared by the booking view and the manage view's
// reschedule flow, so the markup exists in exactly one place. `slots` is a
// flat list of open UTC instants (ISO strings). Grouped by each slot's OWN
// local calendar date (localDateKey), so the day chip and the times listed
// under it always agree on which day they mean, in every timezone: labelling
// the chip from a fabricated `${date}T12:00:00Z` instant instead of a real
// slot in the group is exactly the kind of date arithmetic this page must
// not do, and it silently disagrees with the grid east of about UTC+5:30.
// `zone` is a string (may be '' before mount, see Schedule.jsx) rather than
// computed here, so this component never reads the clock during render.
// `loaded` is false until the caller's fetch settles (success or failure).
// Without it, the empty initial `slots` array reads identically to a
// genuinely empty day, which is exactly what the prerendered HTML (and every
// visitor, until the API round-trip finishes) would show.
function SlotPicker({ slots, day, onDayChange, picked, onPick, locale, zone, c, loaded }) {
  const grouped = useMemo(() => {
    const map = new Map()
    for (const s of slots) {
      const key = localDateKey(s)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(s)
    }
    return map
  }, [slots])

  const days = [...grouped.keys()]
  const times = grouped.get(day) ?? []

  return (
    <>
      <h2>{c.pickDay}</h2>
      <div className="schedule-days">
        {days.map((d) => (
          <button
            key={d}
            type="button"
            className={`schedule-day${d === day ? ' schedule-day-active' : ''}`}
            aria-pressed={d === day}
            onClick={() => onDayChange(d)}
          >
            {dayLabel(grouped.get(d)[0], locale)}
          </button>
        ))}
      </div>

      <h2>{c.pickTime}</h2>
      <p className="schedule-hint">
        {c.yourZone}
        {zone ? ` (${zone})` : ''}
      </p>
      {loaded && times.length === 0 && <p className="schedule-hint">{c.noSlots}</p>}
      <div className="schedule-times">
        {times.map((s) => (
          <button
            key={s}
            type="button"
            className={`schedule-time${s === picked ? ' schedule-time-active' : ''}`}
            aria-pressed={s === picked}
            onClick={() => onPick(s)}
          >
            {timeLabel(s, locale)}
          </button>
        ))}
      </div>
    </>
  )
}

export default SlotPicker
