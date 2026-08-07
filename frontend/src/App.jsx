import Navbar from './components/Navbar'
import Hero from './components/Hero'
import History from './components/History'
import LogoMeaning from './components/LogoMeaning'
import About from './components/About'
import VisionMission from './components/VisionMission'
import Structure from './components/Structure'
import Programs from './components/Programs'
import News from './components/News'
import InformationBoard from './components/InformationBoard'
import AspirationContact from './components/AspirationContact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <History />
      <LogoMeaning />
      <About />
      <VisionMission />
      <Structure />
      <Programs />
      <News />
      <InformationBoard />
      <AspirationContact />
      <Footer />
    </div>
  )
}

export default App

