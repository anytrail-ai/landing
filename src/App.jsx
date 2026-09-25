import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Thanks from './pages/Thanks'
import Demo from './pages/Demo'
import InboundDemo from './pages/InboundDemo'
import Schedule from './pages/Schedule'
import PrivacyCopilot from './pages/PrivacyCopilot'
import QuoteDemo from './pages/QuoteDemo'
import SupplierPrice from './pages/SupplierPrice'
import SiniestrosDemo from './pages/SiniestrosDemo'
import ClusterPage from './components/ClusterPage'
import { LanguageProvider } from './i18n/LanguageContext'
import './App.css'

// Cluster pages are all the same component reading a different copy block, so
// they are registered as thunks rather than as separate page modules.
const PAGES = {
  home: Home,
  thanks: Thanks,
  demo: Demo,
  inboundDemo: InboundDemo,
  schedule: Schedule,
  privacyCopilot: PrivacyCopilot,
  quoteDemo: QuoteDemo,
  supplierPrice: SupplierPrice,
  siniestrosDemo: SiniestrosDemo,
  speedToLead: () => <ClusterPage copyKey="speedToLead" />,
  manufacturingCrm: () => <ClusterPage copyKey="manufacturingCrm" />,
  rfqAutomation: () => <ClusterPage copyKey="rfqAutomation" />,
}

// App-like demos that fill the window and bring their own header.
const FULLSCREEN_PAGES = ['siniestrosDemo']

function App({ lang = 'en', page = 'home' }) {
  const Page = PAGES[page] ?? Home

  if (FULLSCREEN_PAGES.includes(page)) {
    return (
      <LanguageProvider lang={lang} page={page}>
        <Page />
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider lang={lang} page={page}>
      <Navbar />
      <main>
        <Page />
      </main>
      <Footer />
    </LanguageProvider>
  )
}

export default App
