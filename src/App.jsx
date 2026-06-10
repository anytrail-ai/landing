import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TheGap from './components/TheGap'
import Learn from './components/Learn'
import Act from './components/Act'
import Respond from './components/Respond'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TheGap />
        <Learn />
        <Act />
        <Respond />
      </main>
      <Footer />
    </>
  )
}

export default App
