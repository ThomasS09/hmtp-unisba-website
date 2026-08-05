import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import VisionMission from './components/VisionMission'
import Structure from './components/Structure'
import Programs from './components/Programs'
import Footer from './components/Footer'

function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <VisionMission />
      <Structure />
      <Programs />
      <Footer />
    </div>
  )
}

export default App
