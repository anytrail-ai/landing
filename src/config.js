// Absolute URLs the scheduler should redirect to after a successful booking.
// Set these in the scheduler's confirmation/redirect settings, per language.
export const THANKS_URL = {
  en: 'https://www.anytrail.ai/thanks',
  es: 'https://www.anytrail.ai/es/gracias',
}

// WhatsApp number in E.164 without '+' or spaces, e.g. '5215512345678'.
// Leave empty to hide the WhatsApp CTA entirely. Nothing renders until this
// is set, so shipping it blank is safe.
export const WHATSAPP_NUMBER = import.meta.env?.VITE_WHATSAPP_NUMBER ?? ''

// First-party telemetry collector (AWS API Gateway -> Lambda -> DynamoDB).
// Provisioned by infra/telemetry/deploy.sh, which prints this value.
// Leave empty to disable telemetry cleanly; analytics.js no-ops rather than
// throwing.
export const TELEMETRY_URL = import.meta.env?.VITE_TELEMETRY_URL ?? ''
