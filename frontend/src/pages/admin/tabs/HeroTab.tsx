import { useState, useEffect, useCallback } from 'react'
import { getSiteSettings, updateSiteSettings, pesanError } from '../../../services/api'
import TableSkeleton from '../../../components/admin/TableSkeleton'
import TombolSimpan from '../../../components/admin/TombolSimpan'
import type { SiteSettings } from '../../../types'

interface Props {
  showToast: (msg: string, jenis?: 'ok' | 'error') => void
}

// Urutan field = urutan tampil di form. Semua opsional: kalau dikosongkan,
// halaman memakai teks bawaan, jadi tidak mungkin tampil kosong.
const FIELD: { key: keyof SiteSettings; label: string; hint: string; rows: number }[] = [
  { key: 'hero_badge', label: 'Label Kecil di Atas Judul', hint: 'Contoh: Website Resmi HMTP UNISBA', rows: 1 },
  { key: 'hero_title', label: 'Judul Utama', hint: 'Kata terakhir otomatis berwarna emas', rows: 1 },
  { key: 'hero_desc', label: 'Deskripsi Singkat', hint: '1–3 kalimat tentang himpunan', rows: 3 },
  { key: 'hero_cta_primary', label: 'Tombol Utama', hint: 'Mengarah ke blok Kabinet & Struktur', rows: 1 },
  { key: 'hero_cta_secondary', label: 'Tombol Kedua', hint: 'Mengarah ke blok Program Kerja', rows: 1 },
]

export default function HeroTab({ showToast }: Props) {
  const [form, setForm] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      setForm(await getSiteSettings())
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal memuat teks beranda'), 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      setForm(await updateSiteSettings(form))
      showToast('Teks beranda berhasil disimpan')
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menyimpan teks beranda'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <TableSkeleton rows={4} />

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-poppins text-white">Beranda</h2>
        <p className="text-xs text-gray-400 mt-1">
          Teks yang tampil paling atas di halaman depan. Kosongkan sebuah kolom untuk memakai teks bawaan.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
        {FIELD.map((f, i) => (
          <div key={f.key} className="space-y-1.5">
            <label
              htmlFor={`field-herotab-${i + 1}`}
              className="block text-xs font-semibold uppercase tracking-wider text-gray-300"
            >
              {f.label}
              <span className="ml-2 font-normal normal-case tracking-normal text-[11px] text-gray-500">{f.hint}</span>
            </label>
            {f.rows > 1 ? (
              <textarea
                id={`field-herotab-${i + 1}`}
                rows={f.rows}
                value={form[f.key] ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none resize-none"
              />
            ) : (
              <input
                id={`field-herotab-${i + 1}`}
                type="text"
                value={form[f.key] ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
              />
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <TombolSimpan submitting={submitting} />
        </div>
      </div>

      <p className="text-[11px] text-gray-500">
        Perubahan langsung terlihat di halaman depan setelah disimpan (tidak perlu build ulang).
      </p>
    </form>
  )
}