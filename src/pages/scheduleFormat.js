// Formatting helpers shared by Schedule.jsx and SlotPicker.jsx. Every instant
// they touch comes from the server already computed; these only format an
// ISO instant for display and do no date arithmetic themselves.
export const dayLabel = (iso, locale) =>
  new Date(iso).toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })

export const timeLabel = (iso, locale) =>
  new Date(iso).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })

export const zoneLabel = () =>
  new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
    .formatToParts(new Date())
    .find((p) => p.type === 'timeZoneName')?.value ?? ''

// Paired with zoneLabel via useSyncExternalStore in Schedule.jsx: the zone
// abbreviation is a browser-only value that must read as '' on the server
// (and on the client's first, hydration-matching render) and as the real
// zone after that. useSyncExternalStore's getServerSnapshot argument is what
// makes that swap hydration-safe; the zone never changes again after mount,
// so subscribe has nothing to listen for.
export const subscribeNever = () => () => {}
export const getServerZone = () => ''

// Groups a slot by the calendar date it falls on IN THE VIEWER'S OWN ZONE
// (the runtime default, i.e. the browser's zone once mounted). 'en-CA' gives
// a stable YYYY-MM-DD key regardless of the display locale; it is never
// shown, only compared. Deliberately not `iso.slice(0, 10)` (the slot's UTC
// date): east of roughly UTC+5:30 that disagrees with the same instant's
// local day, which is the day a visitor there actually sees on the grid.
export const localDateKey = (iso) => new Date(iso).toLocaleDateString('en-CA')
