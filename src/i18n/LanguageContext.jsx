import { createContext } from 'react'
import { COPY } from './copy'

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext(null)

export function LanguageProvider({ lang, children }) {
  return (
    <LanguageContext.Provider value={{ lang, copy: COPY[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}
