import React, { Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skeleton from './components/Skeleton'

const History = React.lazy(() => import('./components/History'))
const LogoMeaning = React.lazy(() => import('./components/LogoMeaning'))
const About = React.lazy(() => import('./components/About'))
const VisionMission = React.lazy(() => import('./components/VisionMission'))
const Structure = React.lazy(() => import('./components/Structure'))
const Programs = React.lazy(() => import('./components/Programs'))
const News = React.lazy(() => import('./components/News'))
const InformationBoard = React.lazy(() => import('./components/InformationBoard'))
const AspirationContact = React.lazy(() => import('./components/AspirationContact'))
const Footer = React.lazy(() => import('./components/Footer'))

function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <Suspense fallback={<Skeleton />}>

        <div className="performance-contain">
          <History />
        </div>
        <div className="performance-contain">
          <LogoMeaning />
        </div>
        <div className="performance-contain">
          <About />
        </div>
        <div className="performance-contain">
          <VisionMission />
        </div>
        <div className="performance-contain">
          <Structure />
        </div>
        <div className="performance-contain">
          <Programs />
        </div>
        <div className="performance-contain">
          <News />
        </div>
        <div className="performance-contain">
          <InformationBoard />
        </div>
        <div className="performance-contain">
          <AspirationContact />
        </div>
        <div className="performance-contain">
          <Footer />
        </div>
      </Suspense>
    </div>
  )
}

export default App


