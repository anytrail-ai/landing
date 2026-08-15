import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Thanks from './pages/Thanks'
import Demo from './pages/Demo'
import Schedule from './pages/Schedule'
import ClusterPage from './components/ClusterPage'
import { LanguageProvider } from './i18n/LanguageContext'
import './App.css'

// Cluster pages are all the same component reading a different copy block, so
// they are registered as thunks rather than as separate page modules.
const PAGES = {
  home: Home,
  thanks: Thanks,
  demo: Demo,
  schedule: Schedule,
  speedToLead: () => <ClusterPage copyKey="speedToLead" />,
  manufacturingCrm: () => <ClusterPage copyKey="manufacturingCrm" />,
  rfqAutomation: () => <ClusterPage copyKey="rfqAutomation" />,
}

function App({ lang = 'en', page = 'home' }) {
  const Page = PAGES[page] ?? Home

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
