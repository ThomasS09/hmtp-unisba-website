import { Suspense, lazy, ComponentType } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Skeleton from '../components/Skeleton'
import ErrorBoundary from '../components/ErrorBoundary'

const History = lazy(() => import('../components/History'))
const LogoMeaning = lazy(() => import('../components/LogoMeaning'))
const About = lazy(() => import('../components/About'))
const VisionMission = lazy(() => import('../components/VisionMission'))
const Structure = lazy(() => import('../components/Structure'))
const Programs = lazy(() => import('../components/Programs'))
const News = lazy(() => import('../components/News'))
const AspirationContact = lazy(() => import('../components/AspirationContact'))
const Footer = lazy(() => import('../components/Footer'))

interface SectionItem {
  name: string
  Component: ComponentType
}

const lazySections: SectionItem[] = [
  { name: 'Sejarah', Component: History },
  { name: 'Makna Logo', Component: LogoMeaning },
  { name: 'Tentang Kami', Component: About },
  { name: 'Visi & Misi', Component: VisionMission },
  { name: 'Struktur Organisasi', Component: Structure },
  { name: 'Program Kerja', Component: Programs },
  { name: 'Berita & Artikel', Component: News },
  { name: 'Kotak Aspirasi & Kontak', Component: AspirationContact },
  { name: 'Footer', Component: Footer },
]

export default function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <Suspense fallback={<Skeleton />}>
        {lazySections.map(({ name, Component }, i) => (
          <ErrorBoundary key={i} sectionName={name}>
            <Component />
          </ErrorBoundary>
        ))}
      </Suspense>
    </div>
  )
}
