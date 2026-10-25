interface Props {
  rows?: number
  className?: string
}

/**
 * Placeholder saat data dashboard dimuat.
 * Dipakai supaya tab tidak menampilkan teks "Memuat data..." tanpa bentuk,
 * dan supaya pembaca layar tetap dapat pengumuman lewat role="status".
 */
export default function TableSkeleton({ rows = 4, className = '' }: Props) {
  return (
    <div role="status" aria-live="polite" className={`animate-pulse space-y-3 ${className}`}>
      <span className="sr-only">Memuat data…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-14 rounded-xl bg-white/5 border border-white/10" />
      ))}
    </div>
  )
}
