import { createContext } from 'react'
import { copyFor, productFor } from './copy'

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext(null)

// `page` rides along so the language switcher can send a reader to the same
// page in the other language instead of dropping them on the home page. That
// is also what the hreflang tags promise, so the two now agree.
// `product` ('ar' | 'crm' | null on the chooser) picks the copy and decides
// where CTAs, the footer and the thank-you page send the visitor.
export function LanguageProvider({ lang, page = 'home', children }) {
  const value = { lang, page, product: productFor(page), copy: copyFor(lang, page) }
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
