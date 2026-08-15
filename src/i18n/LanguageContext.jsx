import { createContext } from 'react'
import { COPY } from './copy'

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext(null)

// `page` rides along so the language switcher can send a reader to the same
// page in the other language instead of dropping them on the home page. That
// is also what the hreflang tags promise, so the two now agree.
export function LanguageProvider({ lang, page = 'home', children }) {
  return (
    <LanguageContext.Provider value={{ lang, page, copy: COPY[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}
