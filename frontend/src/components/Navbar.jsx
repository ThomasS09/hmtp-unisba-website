import { useState, useEffect } from 'react'
import logo from '../assets/logo.jpg'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuGroups = [
    {
      name: 'Profil HMTP',
      id: 'profil',
      items: [
        { name: 'Sejarah', href: '#sejarah' },
        { name: 'Arti Logo', href: '#logo-meaning' },
        { name: 'Kabinet', href: '#about' },
        { name: 'Visi & Misi', href: '#vision-mission' },
        { name: 'Struktur Organisasi', href: '#structure' },
      ],
    },
    {
      name: 'Aktivitas',
      id: 'aktivitas',
      items: [
        { name: 'Program Kerja', href: '#programs' },
        { name: 'Berita & Artikel', href: '#news' },
      ],
    },
    {
      name: 'Layanan',
      id: 'layanan',
      items: [{ name: 'Aspirasi & Kontak', href: '#aspirasi' }],
    },
  ]

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-black/90 border-b border-primary/20 backdrop-blur-lg py-4'
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo & Branding */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/25 rounded-full blur-sm group-hover:bg-primary/45 transition-all duration-300"></div>
              <img
                src={logo}
                alt="Logo HMTP UNISBA"
                className="relative h-12 w-12 rounded-full border border-primary/50 object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-poppins font-black text-white text-lg tracking-wider leading-none group-hover:text-primary transition-colors">HMTP</span>
              <span className="font-inter text-[10px] text-primary font-bold tracking-widest mt-1">UNISBA</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="font-inter text-sm text-gray-300 hover:text-primary font-semibold transition-colors py-2"
            >
              Beranda
            </a>

            {menuGroups.map((group) => (
              <div
                key={group.id}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(group.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 font-inter text-sm text-gray-300 hover:text-primary font-semibold transition-colors py-2 cursor-pointer">
                  {group.name}
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === group.id ? 'rotate-180 text-primary' : 'text-gray-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Box */}
                <div className={`absolute left-0 mt-1 w-56 rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl p-2 shadow-2xl shadow-black/80 transition-all duration-300 origin-top-left ${
                  activeDropdown === group.id
                    ? 'opacity-100 scale-100 translate-y-0 visible'
                    : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                }`}>
                  <div className="flex flex-col gap-1">
                    {group.items.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="font-inter text-xs text-gray-400 hover:text-black hover:bg-primary font-medium rounded-lg px-3 py-2.5 transition-all duration-200"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors border border-transparent hover:border-white/10"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-[80vh] opacity-100 border-b border-white/10' : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
        <div className="px-4 pt-2 pb-6 space-y-4 bg-black/95 backdrop-blur-xl">
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="block py-2 font-inter text-sm font-semibold text-gray-300 hover:text-primary border-b border-white/5"
          >
            Beranda
          </a>

          {menuGroups.map((group) => (
            <div key={group.id} className="space-y-2">
              <div className="text-xs font-bold text-primary tracking-widest uppercase font-poppins px-1">
                {group.name}
              </div>
              <div className="pl-3 space-y-1 border-l border-white/10">
                {group.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 font-inter text-xs text-gray-400 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
