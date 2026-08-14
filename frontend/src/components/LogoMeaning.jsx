import { useState } from 'react'
import logo from '../assets/logo.jpg'

// Static data defined outside component — avoids re-declaration on every render
const elements = [
  {
    id: 'palu-belincong',
    title: 'Palu dan Belincong',
    desc: 'Memiliki arti disiplin ilmu pertambangan yang menjadi dasar keahlian seluruh anggota himpunan.',
    icon: '⚒️',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'kerang-putih',
    title: 'Kerang Putih',
    desc: 'Melambangkan bahan galian yaitu batu gamping (limestone), dengan warna putih yang bermakna niat tulus dan luhur dalam membangun pertambangan Indonesia.',
    icon: '🐚',
    color: 'from-gray-100 to-slate-300',
  },
  {
    id: 'kabah-i',
    title: "Ka'bah / Huruf 'i'",
    desc: "Mengartikan agama Islam sebagai asas utama dan nilai dasar yang senantiasa dipegang teguh oleh HMTP.",
    icon: '🕋',
    color: 'from-amber-600 to-amber-900',
  },
  {
    id: 'lima-garis',
    title: 'Lima Garis di Atas Kerang',
    desc: 'Menggambarkan rukun Islam yang menjadi pilar iman dan senantiasa mengilhami setiap langkah perjuangan HMTP.',
    icon: '☰',
    color: 'from-yellow-300 to-yellow-500',
  },
  {
    id: 'tujuh-lekukan',
    title: 'Tujuh Lekukan Kerang',
    desc: 'Menandakan bahwa HMTP merupakan bagian dari Fakultas Teknik, yang lahir pada tahap pendirian ke-7 di Universitas Islam Bandung.',
    icon: '❼',
    color: 'from-amber-400 to-yellow-600',
  },
  {
    id: 'kotak-hitam',
    title: 'Kotak Hitam di Belakang',
    desc: 'Memiliki arti sebagai tangga terakhir dalam pencapaian perjuangan dan dedikasi menuju puncak kemenangan.',
    icon: '⬛',
    color: 'from-gray-800 to-black',
  },
  {
    id: 'warna-kuning',
    title: 'Warna Kuning Kebanggaan',
    desc: 'Merupakan warna kebanggaan sekaligus warna pemersatu bagi seluruh mahasiswa Teknik Pertambangan UNISBA.',
    icon: '🟡',
    color: 'from-yellow-300 to-yellow-500',
  },
  {
    id: 'lingkaran-hitam',
    title: 'Lingkaran Hitam',
    desc: 'Menjadi lambang persatuan, kesatuan, dan persaudaraan yang erat di antara mahasiswa Teknik Pertambangan.',
    icon: '⭕',
    color: 'from-neutral-700 to-neutral-900',
  },
]

export default function LogoMeaning() {
  const [activeElement, setActiveElement] = useState(null)

  return (
    <section id="logo-meaning" className="py-24 bg-light-gray text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="font-inter text-xs text-primary font-bold tracking-wider uppercase">Makna Lambang</span>
          </div>
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-white">
            Arti Logo <span className="text-primary text-glow">HMTP UNISBA</span>
          </h2>
          <p className="font-inter text-sm text-gray-400 mt-4 leading-relaxed">
            Setiap simbol dan warna pada lambang himpunan merepresentasikan identitas, visi keislaman, dan semangat perjuangan teknik pertambangan.
          </p>
        </div>

        {/* Layout: Logo Display and Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Interactive Image Frame */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Outer Golden Glow Aura */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition duration-500 scale-95 group-hover:scale-105"></div>
              {/* Inner Glowing Ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-dark-gold to-yellow-600 opacity-70 group-hover:opacity-100 blur-sm transition duration-500"></div>

              <div className="relative bg-black rounded-full p-4 border border-white/10 shadow-2xl">
                <img
                  src={logo}
                  alt="Logo HMTP UNISBA"
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover select-none pointer-events-none"
                />
              </div>
            </div>

            <p className="mt-8 font-inter text-xs text-gray-500 text-center italic">
              Klik atau sentuh setiap kartu untuk melihat detail arti lambang secara interaktif.
            </p>
          </div>

          {/* Right Column: Dynamic Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {elements.map((el) => {
              const isActive = activeElement === el.id
              return (
                <div
                  key={el.id}
                  onClick={() => setActiveElement(isActive ? null : el.id)}
                  onMouseEnter={() => setActiveElement(el.id)}
                  onMouseLeave={() => setActiveElement(null)}
                  className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group select-none ${
                    isActive
                      ? 'border-primary/40 ring-1 ring-primary/20 shadow-[0_0_25px_rgba(255,212,0,0.08)] bg-white/[0.04]'
                      : 'hover:border-white/20'
                  }`}
                >
                  {/* Highlight bar inside card */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${el.color} transition-all duration-300 opacity-60 group-hover:opacity-100`}></div>

                  <div className="pl-3">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{el.icon}</span>
                      <h4 className="font-poppins font-bold text-sm sm:text-base text-white group-hover:text-primary transition-colors">
                        {el.title}
                      </h4>
                    </div>

                    <p className={`font-inter text-xs text-gray-400 leading-relaxed transition-all duration-300 ${
                      isActive ? 'opacity-100 max-h-40 mt-2' : 'opacity-80'
                    }`}>
                      {el.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
