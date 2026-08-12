import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Thanks from './pages/Thanks'
import Demo from './pages/Demo'
import { LanguageProvider } from './i18n/LanguageContext'
import './App.css'

const PAGES = { home: Home, thanks: Thanks, demo: Demo }

function App({ lang = 'en', page = 'home' }) {
  const Page = PAGES[page] ?? Home

  return (
    <LanguageProvider lang={lang}>
      <Navbar />
      <main>
        <Page />
      </main>
      <Footer />
    </LanguageProvider>
  )
}

export default App
