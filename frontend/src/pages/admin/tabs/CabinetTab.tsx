import { useState, useEffect, useCallback } from 'react'
import {
  getCabinets,
  updateCabinet,
  createCabinet,
  activateCabinet,
  deleteCabinet,
  pesanError,
} from '../../../services/api'
import TableSkeleton from '../../../components/admin/TableSkeleton'
import type { Cabinet } from '../../../types'

interface Props {
  showToast: (msg: string) => void
}

const FORM_KOSONG = { name: '', period: '', name_meaning: '', is_active: false }

export default function CabinetTab({ showToast }: Props) {
  const [cabinets, setCabinets] = useState<Cabinet[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState(FORM_KOSONG)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const list = await getCabinets()
      setCabinets(list)
      // Tanpa pilihan eksplisit, form menampilkan kabinet aktif
      if (editingId === null) {
        const aktif = list.find((c) => c.is_active)
        if (aktif) {
          setEditingId(aktif.id)
          setFormData({
            name: aktif.name,
            period: aktif.period,
            name_meaning: aktif.name_meaning || '',
            is_active: aktif.is_active,
          })
        }
      }
    } catch (e) {
      showToast(pesanError(e, 'Gagal memuat data kabinet'))
    } finally {
      setLoading(false)
    }
  }, [editingId, showToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const pilihKabinet = (c: Cabinet) => {
    setEditingId(c.id)
    setFormData({
      name: c.name,
      period: c.period,
      name_meaning: c.name_meaning || '',
      is_active: c.is_active,
    })
  }

  const mulaiBaru = () => {
    setEditingId(null)
    setFormData(FORM_KOSONG)
  }

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

      if (editingId) {
        await updateCabinet(editingId, payload)
        // Hanya satu kabinet boleh aktif sekaligus.
        if (formData.is_active) await activateCabinet(editingId)
        showToast('Data kabinet berhasil diperbarui')
      } else {
        await createCabinet(payload)
        showToast('Kabinet baru berhasil dibuat')
      }
      loadData()
    } catch (e) {
      showToast(pesanError(e, 'Gagal menyimpan kabinet'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleActivate = async (c: Cabinet) => {
    try {
      await activateCabinet(c.id)
      showToast(`Kabinet ${c.name} diaktifkan`)
      loadData()
    } catch (e) {
      showToast(pesanError(e, 'Gagal mengaktifkan kabinet'))
    }
  }

  const handleDelete = async (c: Cabinet) => {
    if (!window.confirm(`Hapus kabinet ${c.name} (${c.period})? Data pengurus di dalamnya ikut terhapus.`)) return
    try {
      await deleteCabinet(c.id)
      showToast('Kabinet berhasil dihapus')
      if (editingId === c.id) mulaiBaru()
      loadData()
    } catch (e) {
      showToast(pesanError(e, 'Gagal menghapus kabinet'))
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-poppins text-white">Kelola Kabinet</h2>
          <p className="text-xs text-gray-400 mt-1">
            Tiap periode satu kabinet. Kabinet lama tetap tersimpan sebagai arsip; hanya satu yang aktif di halaman publik.
          </p>
        </div>
        <button
          type="button"
          onClick={mulaiBaru}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-white/5 border border-white/10 text-white hover:border-primary/40 transition-all cursor-pointer"
        >
          + Kabinet Baru
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={3} />
      ) : (
        <>
          {/* Daftar kabinet (arsip periode sebelumnya ikut tampil) */}
          <div className="space-y-2">
            {cabinets.map((c) => (
              <div
                key={c.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                  editingId === c.id ? 'border-primary/40 bg-primary/5' : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => pilihKabinet(c)}
                  className="text-left flex-1 cursor-pointer"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-poppins font-bold text-sm text-white">{c.name}</span>
                    <span className="text-[11px] text-gray-400">{c.period}</span>
                    {c.is_active ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        AKTIF
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">
                        ARSIP
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500">{c.members_count ?? 0} pengurus</span>
                  </div>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  {!c.is_active && (
                    <button
                      type="button"
                      onClick={() => handleActivate(c)}
                      className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20 transition-all cursor-pointer"
                    >
                      Aktifkan
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    disabled={c.is_active}
                    title={c.is_active ? 'Kabinet aktif tidak bisa dihapus' : 'Hapus kabinet'}
                    className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <p className="text-xs font-semibold uppercase text-primary">
              {editingId ? 'Ubah Kabinet' : 'Kabinet Baru'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="kabinet-nama" className="text-xs font-semibold uppercase text-gray-300">
                  Nama Kabinet
                </label>
                <input
                  type="text"
                  id="kabinet-nama"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Adhikara Karsa"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="kabinet-periode" className="text-xs font-semibold uppercase text-gray-300">
                  Periode
                </label>
                <input
                  type="text"
                  id="kabinet-periode"
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="Contoh: 2026/2027"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="kabinet-makna" className="text-xs font-semibold uppercase text-gray-300">
                Makna Nama Kabinet
              </label>
              <textarea
                id="kabinet-makna"
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
              <label htmlFor="is_active" className="text-xs text-gray-300">
                Kabinet Aktif (tampil di halaman publik)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              {editingId && (
                <button
                  type="button"
                  onClick={mulaiBaru}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-primary hover:bg-dark-gold text-black transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Buat Kabinet'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
