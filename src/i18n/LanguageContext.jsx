import { createContext, useEffect, useState } from 'react'
import { COPY } from './copy'

const STORAGE_KEY = 'anytrail-lang'

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext(null)

function detectInitialLang() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'es') return stored
  } catch {
    /* storage unavailable — fall through to browser language */
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage unavailable — selection just won't persist */
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, copy: COPY[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}
