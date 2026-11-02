import { useState } from 'react'
import type { NewsArticle } from '../../../types'

interface Props {
  newsList: NewsArticle[]
  onCreate: (e: React.MouseEvent<HTMLElement>) => void
  onEdit: (item: NewsArticle, e: React.MouseEvent<HTMLElement>) => void
  onDelete: (id: number) => void
}

/**
 * Tab berita: pencarian, urutan, dan paginasi dikelola di sini supaya
 * dashboard hanya menyimpan data + aksi modal.
 */
export default function NewsTab({ newsList, onCreate, onEdit, onDelete }: Props) {
  const [newsSearch, setNewsSearch] = useState('')
  const [newsSort, setNewsSort] = useState<'newest' | 'oldest'>('newest')
  const [newsPage, setNewsPage] = useState(1)
  const [newsPerPage] = useState(12)

  const terfilter = newsList
    .filter((n) => {
      const q = newsSearch.toLowerCase()
      return !q || n.title?.toLowerCase().includes(q) || n.excerpt?.toLowerCase().includes(q)
    })
    .sort((a, b) =>
      newsSort === 'oldest'
        ? new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        : new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    )

  const totalFilteredNews = terfilter.length
  const maxNewsPages = Math.ceil(totalFilteredNews / newsPerPage) || 1
  const paginatedNews = terfilter.slice((newsPage - 1) * newsPerPage, newsPage * newsPerPage)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-bold text-xl text-white">Manajemen Berita & Kegiatan</h2>
          <p className="text-xs text-gray-400 mt-1">
            Publikasikan kegiatan himpunan, artikel keprofesian tambang, dan prestasi mahasiswa.
          </p>
        </div>

        <button
          onClick={onCreate}
          className="px-4 py-2.5 rounded-xl bg-primary text-black font-poppins font-bold text-xs hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>➕</span> Tulis Berita Baru
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            aria-label="Cari judul artikel berita"
            placeholder="Cari judul artikel..."
            value={newsSearch}
            onChange={(e) => setNewsSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            aria-label="Urutkan berita"
            value={newsSort}
            onChange={(e) => setNewsSort(e.target.value as 'newest' | 'oldest')}
            className="px-3 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>

          <button
            onClick={onCreate}
            className="px-4 py-2.5 rounded-xl bg-primary text-black font-poppins font-bold text-xs hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>➕</span> Berita Baru
          </button>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNews.map((article) => (
          <div
            key={article.id}
            className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-primary/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase">
                  {article.category}
                </span>
                <span className="text-[10px] text-gray-500">
                  {article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID') : 'Baru'}
                </span>
              </div>
              <h3 className="font-poppins font-bold text-sm text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
                {article.excerpt || article.content}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-500">{article.author || 'Humas HMTP'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => onEdit(article, e)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-primary hover:text-black text-gray-200 font-semibold transition-all cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(article.id)}
                  className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-all cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
        {paginatedNews.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 text-xs">
            Tidak ada artikel berita ditemukan. Klik &quot;Berita Baru&quot; untuk menambahkan.
          </div>
        )}
      </div>

      {/* News Pagination Controls */}
      {maxNewsPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setNewsPage((p) => Math.max(1, p - 1))}
            disabled={newsPage === 1}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ←
          </button>
          {Array.from({ length: maxNewsPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setNewsPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                newsPage === p ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setNewsPage((p) => Math.min(maxNewsPages, p + 1))}
            disabled={newsPage === maxNewsPages}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
