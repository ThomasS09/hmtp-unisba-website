import { useSiteData } from '../hooks/useSiteData'
import type { Program } from '../types'

// Hanya "Program Kerja" yang jadi kartu unggulan di landing; "Aktivitas Kerja"
// (33 baris) sudah tampil per bidang di bagian Struktur.
const warnaStatus: Record<string, string> = {
  Rencana: 'bg-white/5 text-gray-300 border-white/10',
  Berjalan: 'bg-primary/10 text-primary border-primary/25',
  Selesai: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
}

export default function Programs() {
  const { data, loading } = useSiteData()
  const programs: Program[] = (data?.programs ?? []).filter((p) => p.type === 'Program Kerja')

  return (
    <section id="programs" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="font-inter text-xs text-primary font-bold tracking-wider uppercase">Program Unggulan</span>
          </div>
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-white">
            Program Kerja Kabinet
          </h2>
          <p className="font-inter text-base text-gray-400 mt-4">
            Inisiatif strategis tiap bidang pada periode {data?.cabinet?.period ?? 'kepengurusan aktif'}.
          </p>
        </div>

        {loading ? (
          <div role="status" aria-live="polite" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <span className="sr-only">Memuat program kerja…</span>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-panel h-56 rounded-3xl border border-white/10 animate-pulse"></div>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <span className="text-4xl block mb-4">📋</span>
            <p className="font-inter text-sm text-gray-400">
              Belum ada program kerja yang ditambahkan pengurus.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((prog) => (
              <article
                key={prog.id}
                className="bg-white/5 border border-white/10 hover:border-primary/30 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <span className="font-inter text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                      {prog.department ?? 'Kabinet'}
                    </span>
                    <span
                      className={`font-inter text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        warnaStatus[prog.status ?? 'Rencana'] ?? warnaStatus.Rencana
                      }`}
                    >
                      {prog.status}
                    </span>
                  </div>

                  <h3 className="font-poppins font-bold text-2xl text-white mb-4 group-hover:text-primary transition-colors duration-300">
                    {prog.name}
                  </h3>

                  {prog.description && (
                    <p className="font-inter text-sm text-gray-400 leading-relaxed mb-6">
                      {prog.description}
                    </p>
                  )}
                </div>

                {prog.schedule && (
                  <p className="font-inter text-xs text-gray-500">🗓️ {prog.schedule}</p>
                )}
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
