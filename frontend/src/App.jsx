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
const AspirationContact = React.lazy(() => import('./components/AspirationContact'))
const Footer = React.lazy(() => import('./components/Footer'))

const lazySections = [
  History,
  LogoMeaning,
  About,
  VisionMission,
  Structure,
  Programs,
  News,
  AspirationContact,
  Footer,
]

function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <Suspense fallback={<Skeleton />}>
        {lazySections.map((Section, i) => (
          <div key={i} className="performance-contain">
            <Section />
          </div>
        ))}
      </Suspense>
    </div>
  )
}

export default App
