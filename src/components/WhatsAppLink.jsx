import { WHATSAPP_NUMBER } from '../config'
import { track } from '../analytics'
import { useLanguage } from '../i18n/useLanguage'
import './WhatsAppLink.css'

// Starts a real conversation with the agent instead of asking for a calendar
// slot. Renders nothing until WHATSAPP_NUMBER is configured, so this is safe to
// ship before the number exists.
function WhatsAppLink({ location, className = '' }) {
  const { lang, copy } = useLanguage()
  if (!WHATSAPP_NUMBER) return null

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    copy.whatsapp.prefill,
  )}`

  return (
    <a
      className={`whatsapp-link ${className}`.trim()}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_cta_click', { location, lang })}
    >
      {copy.whatsapp.cta}
    </a>
  )
}

export default WhatsAppLink
