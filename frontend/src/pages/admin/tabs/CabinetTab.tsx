import { useState, useEffect } from 'react'
import { getCabinets, updateCabinet, createCabinet, activateCabinet, pesanError } from '../../../services/api'
import TableSkeleton from '../../../components/admin/TableSkeleton'
import type { Cabinet } from '../../../types'

interface Props {
  showToast: (msg: string) => void
}

export default function CabinetTab({ showToast }: Props) {
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    period: '',
    name_meaning: '',
    is_active: true,
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const list = await getCabinets()
      const active = list.find((c) => c.is_active) ?? list[0]
      if (active) {
        setSelectedCabinet(active)
        setFormData({
          name: active.name,
          period: active.period,
          name_meaning: active.name_meaning || '',
          is_active: active.is_active,
        })
      }
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal memuat data kabinet'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Backend mengharapkan format TAHUN/TAHUN.
      const period = formData.period.trim().replace(/[^\d]+/g, '/').replace(/\/$/, '')
      const payload = {
        name: formData.name.trim(),
        period,
        name_meaning: formData.name_meaning,
        is_active: formData.is_active,
      }

      if (selectedCabinet?.id) {
        await updateCabinet(selectedCabinet.id, payload)
        // Hanya satu kabinet boleh aktif sekaligus.
        if (formData.is_active) await activateCabinet(selectedCabinet.id)
        showToast('Data kabinet berhasil diperbarui')
      } else {
        await createCabinet(payload)
        showToast('Kabinet baru berhasil dibuat')
      }
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menyimpan kabinet'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold font-poppins text-white">Kelola Informasi Kabinet</h2>
        <p className="text-xs text-gray-400 mt-1">
          Perbarui nama kabinet, periode kepengurusan, semboyan, slogan, dan filosofi.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={3} />
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-gray-300">Nama Kabinet</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Adhikara Karsa"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-gray-300">Periode</label>
              <input
                type="text"
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="Contoh: 2026/2027"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-300">Makna Nama Kabinet</label>
            <textarea
              rows={5}
              value={formData.name_meaning}
              onChange={(e) => setFormData({ ...formData, name_meaning: e.target.value })}
              placeholder="Penjelasan makna nama kabinet..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="accent-primary w-4 h-4"
            />
            <label htmlFor="is_active" className="text-xs text-gray-300">Kabinet Aktif (tampil di halaman publik)</label>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-primary hover:bg-dark-gold text-black transition-all disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Data Kabinet'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
