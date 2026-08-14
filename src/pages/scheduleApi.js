// Client for the scheduling routes on the demo backend. Mirrors demoApi.js.
const API_URL = 'https://3cyy3hfm3a.execute-api.us-east-1.amazonaws.com'

async function request(path, { method = 'POST', body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `http_${res.status}`)
  return data
}

export const openSlots = () => request('/schedule/slots', { method: 'GET' })
export const bookSlot = (input) => request('/schedule/book', { body: input })
export const viewBooking = (b, s) =>
  request(`/schedule/manage?b=${encodeURIComponent(b)}&s=${encodeURIComponent(s)}`, {
    method: 'GET',
  })
export const cancelBooking = (slotStartUtc, sig) =>
  request('/schedule/cancel', { body: { slotStartUtc, sig } })
export const moveBooking = (slotStartUtc, sig, toSlotStartUtc) =>
  request('/schedule/move', { body: { slotStartUtc, sig, toSlotStartUtc } })
