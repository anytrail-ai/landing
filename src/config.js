// Booking destination for every CTA.
//
// This is currently a Google Appointment Schedule, which cannot ask
// qualification questions, cannot redirect to /thanks after booking (so
// bookings are unmeasurable), has weak reminders, and has no Spanish version.
// Swap it for a Cal.com or Calendly link and point that scheduler's
// "redirect on booking" setting at THANKS_URL below.
export const DEMO_URL = 'https://calendar.app.google/RRXx172BHw4CXL4z7'

// Absolute URLs the scheduler should redirect to after a successful booking.
// Set these in the scheduler's confirmation/redirect settings, per language.
export const THANKS_URL = {
  en: 'https://www.anytrail.ai/thanks',
  es: 'https://www.anytrail.ai/es/gracias',
}

// WhatsApp number in E.164 without '+' or spaces, e.g. '5215512345678'.
// Leave empty to hide the WhatsApp CTA entirely — nothing renders until this
// is set, so shipping it blank is safe.
export const WHATSAPP_NUMBER = import.meta.env?.VITE_WHATSAPP_NUMBER ?? ''

// First-party telemetry collector (AWS API Gateway -> Lambda -> DynamoDB).
// Provisioned by infra/telemetry/deploy.sh, which prints this value.
// Leave empty to disable telemetry cleanly; analytics.js no-ops rather than
// throwing.
export const TELEMETRY_URL = import.meta.env?.VITE_TELEMETRY_URL ?? ''
