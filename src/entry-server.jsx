// Server entry used only by the static prerender in prerender.js.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import './index.css'
import App from './App.jsx'

export function render(lang, page) {
  return renderToString(
    <StrictMode>
      <App lang={lang} page={page} />
    </StrictMode>,
  )
}
