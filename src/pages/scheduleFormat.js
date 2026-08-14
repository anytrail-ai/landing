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
