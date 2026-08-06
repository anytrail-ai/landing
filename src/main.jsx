import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { langFromPath } from './i18n/copy'

const lang = langFromPath(window.location.pathname)
const container = document.getElementById('root')
const tree = (
  <StrictMode>
    <App lang={lang} />
  </StrictMode>
)

// Production HTML is prerendered, so hydrate it. The dev server ships an empty
// root, so fall back to a client render there.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
