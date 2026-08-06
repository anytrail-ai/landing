import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { routeFromPath } from './i18n/copy'
import { initAnalytics } from './analytics'

const { lang, page } = routeFromPath(window.location.pathname)
const container = document.getElementById('root')
const tree = (
  <StrictMode>
    <App lang={lang} page={page} />
  </StrictMode>
)

// Production HTML is prerendered, so hydrate it. The dev server ships an empty
// root, so fall back to a client render there.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}

initAnalytics()
