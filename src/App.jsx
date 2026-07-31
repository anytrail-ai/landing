import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import HowItWorks from './components/HowItWorks'
import Different from './components/Different'
import Proof from './components/Proof'
import ClosingCTA from './components/ClosingCTA'
import Footer from './components/Footer'
import { LanguageProvider } from './i18n/LanguageContext'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Different />
        <Proof />
        <ClosingCTA />
      </main>
      <Footer />
    </LanguageProvider>
  )
}

export default App
