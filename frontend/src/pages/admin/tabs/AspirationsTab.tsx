import { useState } from 'react'
import type { Aspiration } from '../../../types'

interface Props {
  aspirations: Aspiration[]
  onExport: () => void
  onDetail: (item: Aspiration, e: React.MouseEvent<HTMLElement>) => void
  onToggleStatus: (item: Aspiration) => void
  onDelete: (id: number) => void
}

/**
 * Tab kotak aspirasi: saringan, urutan, dan paginasi lokal.
 * Data & aksi server tetap dipegang dashboard supaya modal detail bisa dipakai bersama.
 */
export default function AspirationsTab({ aspirations, onExport, onDetail, onToggleStatus, onDelete }: Props) {
  const [aspirationPage, setAspirationPage] = useState(1)
  const [aspirationPerPage, setAspirationPerPage] = useState(10)
  const [aspirationFilter, setAspirationFilter] = useState('Semua')
  const [aspirationSearch, setAspirationSearch] = useState('')
  const [aspirationSort, setAspirationSort] = useState<'newest' | 'oldest' | 'status'>('newest')

  const terfilter = aspirations
    .filter((item) => {
      const matchCat = aspirationFilter === 'Semua' || item.category === aspirationFilter
      const q = aspirationSearch.toLowerCase()
      const matchSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        (item.nim && item.nim.toLowerCase().includes(q)) ||
        item.message?.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
    .sort((a, b) => {
      if (aspirationSort === 'status') {
        if (a.status === b.status) return 0
        return a.status === 'Pending' ? -1 : 1
      }
      const selisih =
        new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      return aspirationSort === 'oldest' ? selisih : -selisih
    })

  const totalFilteredAspirations = terfilter.length
  const maxAspirationsPages = Math.ceil(totalFilteredAspirations / aspirationPerPage) || 1
  const paginatedAspirations = terfilter.slice(
    (aspirationPage - 1) * aspirationPerPage,
    aspirationPage * aspirationPerPage
  )

  // Saringan berubah -> kembali ke halaman 1
  const ubahFilter = (nilai: string) => {
    setAspirationFilter(nilai)
    setAspirationPage(1)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-bold text-xl text-white">Kotak Suara Aspirasi Mahasiswa</h2>
          <p className="text-xs text-gray-400 mt-1">
            Kelola kritik, saran, serta pertanyaan yang dikirimkan melalui website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            title="Mengunduh seluruh aspirasi dalam format CSV yang bisa dibuka di Excel"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span aria-hidden="true">📥</span> Unduh CSV (bisa dibuka di Excel)
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            aria-label="Cari aspirasi berdasarkan nama, NIM, atau isi pesan"
            placeholder="Cari berdasarkan nama, NIM, atau kata kunci pesan..."
            value={aspirationSearch}
            onChange={(e) => setAspirationSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['Semua', 'Saran', 'Kritik', 'Akademik', 'Fasilitas'].map((cat) => (
            <button
              key={cat}
              onClick={() => ubahFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                aspirationFilter === cat
                  ? 'bg-primary text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          aria-label="Urutkan aspirasi"
          value={aspirationSort}
          onChange={(e) => setAspirationSort(e.target.value as 'newest' | 'oldest' | 'status')}
          className="px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="status">Status (Pending dulu)</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          Menampilkan{' '}
          <span className="text-white font-semibold">
            {totalFilteredAspirations === 0 ? 0 : (aspirationPage - 1) * aspirationPerPage + 1}-
            {Math.min(aspirationPage * aspirationPerPage, totalFilteredAspirations)}
          </span>{' '}
          dari <span className="text-white font-semibold">{totalFilteredAspirations}</span> aspirasi
        </span>
      </div>

      {/* Aspirations List / Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-gray-400 font-semibold uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Pengirim</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Pesan Aspirasi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedAspirations.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-[11px] text-gray-500">NIM: {item.nim || '-'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-primary border border-primary/20 text-[10px] font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="line-clamp-2 text-gray-300">{item.message}</p>
                    <button
                      onClick={(e) => onDetail(item, e)}
                      className="text-[11px] text-primary hover:underline mt-0.5 font-medium cursor-pointer"
                    >
                      Baca Lengkap
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onToggleStatus(item)}
                      title="Klik untuk ubah status"
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer transition-all ${
                        item.status === 'Selesai'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                      }`}
                    >
                      {item.status === 'Selesai' ? '✓ Selesai' : '⏳ Pending'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap text-[11px]">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Baru saja'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => onDetail(item, e)}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] font-medium cursor-pointer"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-medium cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedAspirations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Tidak ditemukan aspirasi yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {maxAspirationsPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Tampilkan</span>
            <select
              aria-label="Jumlah aspirasi per halaman"
              value={aspirationPerPage}
              onChange={(e) => {
                setAspirationPerPage(Number(e.target.value))
                setAspirationPage(1)
              }}
              className="px-2 py-1 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>per halaman</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAspirationPage((p) => Math.max(1, p - 1))}
              disabled={aspirationPage === 1}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              ← Sebelumnya
            </button>

            {Array.from({ length: maxAspirationsPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === maxAspirationsPages || Math.abs(p - aspirationPage) <= 1)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center gap-1.5">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-gray-600 text-xs px-1">…</span>
                  )}
                  <button
                    onClick={() => setAspirationPage(p)}
                    className={`min-w-[32px] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      aspirationPage === p
                        ? 'bg-primary text-black'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}

            <button
              onClick={() => setAspirationPage((p) => Math.min(maxAspirationsPages, p + 1))}
              disabled={aspirationPage === maxAspirationsPages}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Berikutnya →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
