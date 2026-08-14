import { useMemo } from 'react'
import { dayLabel, timeLabel, zoneLabel } from './scheduleFormat'

// Day-and-time grid shared by the booking view and the manage view's
// reschedule flow, so the markup exists in exactly one place. `slots` is a
// flat list of open UTC instants (ISO strings); `day` groups them by their
// UTC date prefix for the day row. Selection state lives with the caller so
// the two views can each keep their own.
function SlotPicker({ slots, day, onDayChange, picked, onPick, locale, c }) {
  const days = useMemo(() => [...new Set(slots.map((s) => s.slice(0, 10)))], [slots])
  const times = useMemo(() => slots.filter((s) => s.startsWith(day ?? '')), [slots, day])

  return (
    <>
      <h2>{c.pickDay}</h2>
      <div className="schedule-days">
        {days.map((d) => (
          <button
            key={d}
            type="button"
            className={`schedule-day${d === day ? ' schedule-day-active' : ''}`}
            onClick={() => onDayChange(d)}
          >
            {dayLabel(`${d}T12:00:00Z`, locale)}
          </button>
        ))}
      </div>

      <h2>{c.pickTime}</h2>
      <p className="schedule-hint">
        {c.yourZone} ({zoneLabel()})
      </p>
      {times.length === 0 && <p className="schedule-hint">{c.noSlots}</p>}
      <div className="schedule-times">
        {times.map((s) => (
          <button
            key={s}
            type="button"
            className={`schedule-time${s === picked ? ' schedule-time-active' : ''}`}
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
