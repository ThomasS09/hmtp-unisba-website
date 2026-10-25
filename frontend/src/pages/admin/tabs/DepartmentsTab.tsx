import { useState, useEffect } from 'react'
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, pesanError } from '../../../services/api'
import TableSkeleton from '../../../components/admin/TableSkeleton'
import type { Department } from '../../../types'

interface Props {
  showToast: (msg: string) => void
}

export default function DepartmentsTab({ showToast }: Props) {
  const [items, setItems] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', sort_order: 0 })

  const loadData = async () => {
    setLoading(true)
    try {
      setItems(await getDepartments())
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal memuat data bidang'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setFormData({ name: '', sort_order: 0 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    setSubmitting(true)
    try {
      const payload = {
        name: formData.name.trim(),
        sort_order: Number(formData.sort_order) || 0,
      }
      if (editingId) {
        await updateDepartment(editingId, payload)
        showToast('Bidang berhasil diperbarui')
      } else {
        await createDepartment(payload)
        showToast('Bidang berhasil ditambahkan')
      }
      resetForm()
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menyimpan bidang'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus bidang ini? Bidang yang masih punya proker/aker tidak bisa dihapus.')) return
    try {
      await deleteDepartment(id)
      showToast('Bidang berhasil dihapus')
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menghapus bidang'))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-poppins text-white">Kelola Bidang & Divisi</h2>
        <p className="text-xs text-gray-400 mt-1">Daftar bidang kerja beserta urutan tampilnya di halaman publik.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-300">Nama Bidang</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Bidang Kaderisasi"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-300">Urutan</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-dark-gold text-black transition-all disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Bidang'}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {loading ? (
          <TableSkeleton rows={4} />
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-500">Belum ada bidang.</div>
        ) : (
          items.map((dept) => (
            <div
              key={dept.id}
              className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-semibold text-white">{dept.name}</p>
                <p className="text-[11px] text-gray-500 font-inter">
                  slug: {dept.slug} · urutan: {dept.sort_order}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(dept.id)
                    setFormData({ name: dept.name, sort_order: dept.sort_order })
                  }}
                  className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-white/5 hover:bg-primary/20 text-gray-200 hover:text-primary transition-all"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(dept.id)}
                  className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
