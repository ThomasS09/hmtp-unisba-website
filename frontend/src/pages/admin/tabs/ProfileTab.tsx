import { useState, useEffect } from 'react'
import { getProfileItems, createProfileItem, updateProfileItem, deleteProfileItem, pesanError } from '../../../services/api'
import TableSkeleton from '../../../components/admin/TableSkeleton'
import type { ProfileItem } from '../../../types'

interface Props {
  showToast: (msg: string) => void
}

export default function ProfileTab({ showToast }: Props) {
  const [items, setItems] = useState<ProfileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState<'visi' | 'misi'>('misi')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      setItems(await getProfileItems())
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal memuat data profil'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    try {
      if (editingId) {
        await updateProfileItem(editingId, { type: activeType, body: content.trim() })
        showToast('Profil berhasil diperbarui')
      } else {
        await createProfileItem({ type: activeType, body: content.trim() })
        showToast('Item profil berhasil ditambahkan')
      }
      setContent('')
      setEditingId(null)
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menyimpan profil'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: ProfileItem) => {
    setEditingId(item.id)
    setActiveType(item.type)
    setContent(item.body)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus item ini?')) return
    try {
      await deleteProfileItem(id)
      showToast('Item berhasil dihapus')
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menghapus item'))
    }
  }

  const filtered = items.filter((i) => i.type === activeType)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-poppins text-white">Kelola Visi & Misi</h2>
          <p className="text-xs text-gray-400 mt-1">Atur butir-butir Visi dan Misi yang tampil di halaman utama.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => { setActiveType('visi'); setEditingId(null); setContent('') }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeType === 'visi' ? 'bg-primary text-black' : 'text-gray-300 hover:text-white'
            }`}
          >
            Visi
          </button>
          <button
            type="button"
            onClick={() => { setActiveType('misi'); setEditingId(null); setContent('') }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeType === 'misi' ? 'bg-primary text-black' : 'text-gray-300 hover:text-white'
            }`}
          >
            Misi
          </button>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
          {editingId ? `Edit Butir ${activeType.toUpperCase()}` : `Tambah Butir ${activeType.toUpperCase()}`}
        </label>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Tulis butir ${activeType} di sini...`}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none resize-none"
        />
        <div className="flex gap-2 justify-end">
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setContent('') }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-dark-gold text-black transition-all disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah'}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <TableSkeleton rows={4} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-500">Belum ada butir {activeType}.</div>
        ) : (
          filtered.map((item, idx) => (
            <div
              key={item.id}
              className="glass-panel p-4 rounded-xl border border-white/10 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{item.body}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-white/5 hover:bg-primary/20 text-gray-200 hover:text-primary transition-all"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
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
