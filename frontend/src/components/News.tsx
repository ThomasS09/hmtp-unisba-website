import { useState, useEffect, useRef } from 'react'
import { getNews } from '../services/api'
import type { NewsArticle } from '../types'

const categories = ['Semua', 'Kegiatan', 'Prestasi', 'Akademik', 'Sosial']

const categoryIcons: Record<string, string> = {
  Kegiatan: '💼',
  Prestasi: '🏆',
  Akademik: '📖',
  Sosial: '🤝',
}

// ponytail: isi artikel ikut di respons daftar (4 berita ≈ 2,8 KB), jadi detail
// dibuka dari state tanpa request tambahan. Kalau nanti isi artikel jadi panjang,
// keluarkan `content` dari index dan muat lewat GET /api/news/{id}.
export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState<NewsArticle | null>(null)
  const pemicuRef = useRef<HTMLButtonElement | null>(null)
  const tutupRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    let alive = true
    getNews()
      .then((data) => {
        if (alive) setArticles(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (alive) setArticles([])
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const tutup = () => {
    setSelected(null)
    pemicuRef.current?.focus()
  }

  // Escape menutup detail; fokus dipindah ke tombol tutup saat dibuka
  useEffect(() => {
    if (!selected) return
    tutupRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') tutup()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  const filteredArticles = articles.filter((art) => {
    const cocokKategori = selectedCategory === 'Semua' || art.category === selectedCategory
    const kata = searchQuery.toLowerCase()
    const cocokCari =
      art.title.toLowerCase().includes(kata) || (art.excerpt ?? '').toLowerCase().includes(kata)
    return cocokKategori && cocokCari
  })

  const paragraf = (art: NewsArticle) => (art.content || art.excerpt || '').split(/\n{2,}/)

  return (
    <section id="news" className="py-24 bg-black text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="font-inter text-xs text-primary font-bold tracking-wider uppercase">Publikasi & Jaringan</span>
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
            <label htmlFor="cari-berita" className="sr-only">Cari artikel</label>
            <input
              type="text"
              id="cari-berita"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 bg-white/5 border border-white/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl font-inter text-sm text-white placeholder-gray-500 outline-none transition-all duration-300"
            />
            <span aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Filter category tabs */}
        <div className="flex flex-wrap gap-2.5 mb-10 border-b border-white/5 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
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
        {loading ? (
          <div role="status" aria-live="polite" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <span className="sr-only">Memuat berita…</span>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-panel h-80 rounded-3xl border border-white/10 animate-pulse"></div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                className="glass-panel group border border-white/10 hover:border-primary/20 rounded-3xl overflow-hidden hover:shadow-[0_0_40px_rgba(255,212,0,0.04)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className={`h-48 w-full bg-gradient-to-br ${art.gradient ?? 'from-zinc-700/40 to-neutral-800/40'} flex items-center justify-center relative p-6 border-b border-white/5`}>
                  <div className="absolute top-4 left-4 font-inter text-[10px] font-black tracking-widest bg-black/60 border border-white/15 px-3 py-1 rounded-full text-primary uppercase">
                    {art.category}
                  </div>
                  {art.read_time && (
                    <div className="absolute bottom-4 right-4 font-inter text-[10px] text-gray-400">
                      ⏱️ {art.read_time}
                    </div>
                  )}
                  <span aria-hidden="true" className="text-4xl filter drop-shadow opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 select-none">
                    {categoryIcons[art.category] ?? '📰'}
                  </span>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-inter text-xs text-gray-500 block mb-2">
                      {art.date} • Oleh {art.author}
                    </span>
                    <h3 className="font-poppins font-bold text-lg sm:text-xl text-white mb-4 group-hover:text-primary transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="font-inter text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
                      {art.excerpt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      pemicuRef.current = e.currentTarget
                      setSelected(art)
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary tracking-wider uppercase cursor-pointer group/btn"
                  >
                    Baca Selengkapnya
                    <svg aria-hidden="true" className="w-4 h-4 transform group-hover/btn:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <span aria-hidden="true" className="text-4xl block mb-4">📂</span>
            <p className="font-inter text-gray-400 text-sm">
              {articles.length === 0
                ? 'Belum ada berita yang dipublikasikan pengurus.'
                : 'Tidak ada artikel yang cocok dengan pencarian Anda.'}
            </p>
          </div>
        )}
      </div>

      {/* Detail artikel */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={tutup}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-detail-berita"
            onClick={(e) => e.stopPropagation()}
            className="glass-panel rounded-3xl border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 animate-fade-in"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="font-inter text-[11px] font-bold tracking-widest text-primary uppercase">
                  {selected.category}
                </span>
                <p className="font-inter text-xs text-gray-500 mt-1">
                  {selected.date} • Oleh {selected.author}
                  {selected.read_time ? ` • ${selected.read_time}` : ''}
                </p>
              </div>
              <button
                type="button"
                ref={tutupRef}
                onClick={tutup}
                aria-label="Tutup detail berita"
                className="text-gray-400 hover:text-white text-lg cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <h3 id="judul-detail-berita" className="font-poppins font-bold text-xl sm:text-2xl text-white mb-4 leading-snug">
              {selected.title}
            </h3>

            <div className="space-y-3">
              {paragraf(selected).map((teks, i) => (
                <p key={i} className="font-inter text-sm text-gray-300 leading-relaxed">
                  {teks}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
