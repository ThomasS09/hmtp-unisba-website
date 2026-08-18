import { useState, useEffect } from 'react'
import { getNews } from '../services/api'

// Static data defined outside component — avoids re-declaration on every render
const categories = ['Semua', 'Kegiatan', 'Prestasi', 'Akademik', 'Sosial']

const fallbackArticles = [
  {
    id: 1,
    title: 'Kunjungan Industri Tambang 2026: Memahami Operasi Lapangan Secara Langsung',
    category: 'Kegiatan',
    date: '15 Juli 2026',
    excerpt: 'Mahasiswa Teknik Pertambangan UNISBA melakukan kunjungan industri lapangan untuk mempelajari teknologi penambangan terbuka secara langsung dan berkelanjutan.',
    author: 'Humas HMTP',
    readTime: '5 menit',
    gradient: 'from-amber-600/30 to-yellow-500/25',
  },
  {
    id: 2,
    title: 'Delegasi HMTP UNISBA Sabet Juara Umum di National Mining Competition VII',
    category: 'Prestasi',
    date: '28 Juni 2026',
    excerpt: 'HMTP UNISBA berhasil membawa pulang piala juara umum pada ajang kompetisi keprofesian tambang nasional mengalahkan puluhan universitas besar lainnya.',
    author: 'Departemen Seni & Olahraga',
    readTime: '4 menit',
    gradient: 'from-yellow-500/35 to-amber-700/20',
  },
  {
    id: 3,
    title: 'Seminar Keprofesian: Peran Insinyur Tambang dalam Era Transisi Energi Hijau',
    category: 'Akademik',
    date: '12 Mei 2026',
    excerpt: 'Mengupas tantangan dekarbonisasi dan implementasi teknologi ramah lingkungan di industri pertambangan demi kelestarian alam nusantara.',
    author: 'Bidang Keilmuan',
    readTime: '6 menit',
    gradient: 'from-zinc-700/40 to-neutral-800/40',
  },
  {
    id: 4,
    title: 'Bakti Sosial HMTP Peduli: Menyalurkan Bantuan untuk Warga Lingkar Tambang',
    category: 'Sosial',
    date: '20 April 2026',
    excerpt: 'Sebagai bentuk pengabdian kepada masyarakat, mahasiswa pertambangan membagikan sembako dan menyelenggarakan posko kesehatan gratis.',
    author: 'Departemen Sosial & Keagamaan',
    readTime: '3 menit',
    gradient: 'from-amber-700/30 to-yellow-600/20',
  },
]

// Category icon map
const categoryIcons = {
  Kegiatan: '💼',
  Prestasi: '🏆',
  Akademik: '📖',
  Sosial: '🤝',
}

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState(fallbackArticles)
  const [loading, setLoading] = useState(true)
  const [isApiConnected, setIsApiConnected] = useState(false)

  useEffect(() => {
    setLoading(true)
    getNews()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          // Normalize keys if needed (read_time -> readTime)
          const formatted = data.map(item => ({
            ...item,
            readTime: item.read_time || item.readTime || '5 menit'
          }))
          setArticles(formatted)
          setIsApiConnected(true)
        }
      })
      .catch((err) => {
        console.warn('Backend API connection warning. Using static fallback data.', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'Semua' || art.category === selectedCategory
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="news" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="font-inter text-xs text-primary font-bold tracking-wider uppercase">Publikasi & Jaringan</span>
              {isApiConnected && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> API Connected
                </span>
              )}
            </div>
            <h2 className="font-poppins font-black text-4xl md:text-5xl text-white">
              Kabar & <span className="text-primary text-glow">Artikel Terbaru</span>
            </h2>
            <p className="font-inter text-sm text-gray-400 mt-4 leading-relaxed">
              Ikuti terus update kegiatan, prestasi mahasiswa, seminar keprofesian, dan kabar terhangat seputar dunia pertambangan UNISBA.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 bg-white/5 border border-white/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl font-inter text-sm text-white placeholder-gray-500 outline-none transition-all duration-300"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Filter category tabs */}
        <div className="flex flex-wrap gap-2.5 mb-10 border-b border-white/5 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-inter text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-black border-primary shadow-lg shadow-primary/10'
                  : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                className="glass-panel group border border-white/10 hover:border-primary/20 rounded-3xl overflow-hidden hover:shadow-[0_0_40px_rgba(255,212,0,0.04)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Card Header */}
                <div className={`h-48 w-full bg-gradient-to-br ${art.gradient} flex items-center justify-center relative p-6 border-b border-white/5`}>
                  <div className="absolute top-4 left-4 font-inter text-[10px] font-black tracking-widest bg-black/60 border border-white/15 px-3 py-1 rounded-full text-primary uppercase">
                    {art.category}
                  </div>
                  <div className="absolute bottom-4 right-4 font-inter text-[10px] text-gray-400">
                    ⏱️ {art.readTime}
                  </div>
                  <span className="text-4xl filter drop-shadow opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 select-none">
                    {categoryIcons[art.category]}
                  </span>
                </div>

                {/* Content area */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-inter text-xs text-gray-500 block mb-2">{art.date} • Oleh {art.author}</span>
                    <h3 className="font-poppins font-bold text-lg sm:text-xl text-white mb-4 group-hover:text-primary transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="font-inter text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
                      {art.excerpt}
                    </p>
                  </div>

                  <a
                    href="#news"
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary tracking-wider uppercase group/btn"
                  >
                    Baca Selengkapnya
                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <span className="text-4xl block mb-4">📂</span>
            <p className="font-inter text-gray-400 text-sm">Tidak ada artikel yang cocok dengan pencarian Anda.</p>
          </div>
        )}

      </div>
    </section>
  )
}
