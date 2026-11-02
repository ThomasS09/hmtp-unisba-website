import type { Aspiration, NewsArticle } from '../../../types'

interface Props {
  totalAspirations: number
  pendingAspirations: number
  aspirationCompletionRate: number
  newsCategoryStats: Record<string, number>
  totalNews: number
  backendOnline: boolean
  aspirations: Aspiration[]
  newsList: NewsArticle[]
  onTab: (tab: 'aspirations' | 'news') => void
  onDetail: (item: Aspiration, e: React.MouseEvent<HTMLElement>) => void
  onEditNews: (item: NewsArticle, e: React.MouseEvent<HTMLElement>) => void
}

/**
 * Ringkasan: KPI + daftar terbaru. Angka dihitung dashboard supaya
 * badge tab dan kartu KPI selalu memakai sumber yang sama.
 */
export default function OverviewTab({
  totalAspirations,
  pendingAspirations,
  aspirationCompletionRate,
  newsCategoryStats,
  totalNews,
  backendOnline,
  aspirations,
  newsList,
  onTab,
  onDetail,
  onEditNews,
}: Props) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Aspirasi</span>
            <span className="text-2xl">📬</span>
          </div>
          <div className="font-poppins font-black text-3xl text-white">{totalAspirations}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${aspirationCompletionRate}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">{aspirationCompletionRate}% Selesai</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Aspirasi Pending</span>
            <span className="text-2xl">⏳</span>
          </div>
          <div className="font-poppins font-black text-3xl text-primary">{pendingAspirations}</div>
          <p className="text-[11px] text-gray-400 mt-1">Perlu respon tim Humas</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Artikel Publikasi</span>
            <span className="text-2xl">📰</span>
          </div>
          <div className="font-poppins font-black text-3xl text-white">{totalNews}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(newsCategoryStats).map(([cat, count]) => (
              count > 0 && (
                <span key={cat} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">
                  {cat}: {count}
                </span>
              )
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Koneksi Backend</span>
            <span className="text-2xl">🔌</span>
          </div>
          <div className="font-poppins font-black text-lg text-emerald-400 mt-1">
            {backendOnline ? 'REST API Online' : 'Mode Demo / Offline'}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Status koneksi ke database</p>
        </div>
      </div>

      {/* Quick Overview Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Aspirations */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-poppins font-bold text-base text-white flex items-center gap-2">
              <span>📬</span> Aspirasi Terbaru
            </h2>
            <button
              onClick={() => onTab('aspirations')}
              className="text-xs text-primary hover:underline font-semibold cursor-pointer"
            >
              Lihat Semua &rarr;
            </button>
          </div>
          <div className="space-y-3">
            {[...aspirations]
              .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
              .slice(0, 4)
              .map((item) => (
              <div
                key={item.id}
                onClick={(e) => {
                  onTab('aspirations')
                  onDetail(item, e)
                }}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-xs text-white">{item.name}</span>
                    <span className="text-[10px] text-gray-500">NIM: {item.nim || '-'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-1">{item.message}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap font-medium ${
                    item.status === 'Selesai'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {item.status || 'Pending'}
                </span>
              </div>
            ))}
            {aspirations.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-6">Belum ada aspirasi masuk.</p>
            )}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-poppins font-bold text-base text-white flex items-center gap-2">
              <span>📰</span> Berita & Publikasi Terbaru
            </h2>
            <button
              onClick={() => onTab('news')}
              className="text-xs text-primary hover:underline font-semibold cursor-pointer"
            >
              Kelola &rarr;
            </button>
          </div>
          <div className="space-y-3">
            {[...newsList]
              .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
              .slice(0, 3)
              .map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3"
              >
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-primary font-semibold">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-500">{item.author}</span>
                  </div>
                  <h3 className="font-semibold text-xs text-white line-clamp-1">{item.title}</h3>
                </div>
                <button
                  onClick={(e) => onEditNews(item, e)}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-primary hover:text-black text-[11px] font-semibold transition-colors shrink-0 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            ))}
            {newsList.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-6">Belum ada berita dibuat.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
