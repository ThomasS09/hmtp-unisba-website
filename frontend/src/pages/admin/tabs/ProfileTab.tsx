import { useState, useEffect, useCallback } from 'react'
import { getProfileItems, createProfileItem, updateProfileItem, deleteProfileItem, pesanError } from '../../../services/api'
import TableSkeleton from '../../../components/admin/TableSkeleton'
import TombolSimpan from '../../../components/admin/TombolSimpan'
import type { ProfileItem, ProfileType } from '../../../types'

interface Props {
  showToast: (msg: string, jenis?: 'ok' | 'error') => void
}

// Satu tempat untuk jenis butir + penjelasan singkat buat pengurus.
const JENIS: { key: ProfileType; label: string; hint: string; contoh: string }[] = [
  { key: 'sejarah', label: 'Sejarah', hint: 'Teks pembuka blok Sejarah di halaman depan.', contoh: 'Menelusuri sejarah panjang berdirinya HMTP UNISBA sejak 1983.' },
  { key: 'logo', label: 'Arti Logo', hint: 'Teks pembuka blok Arti Logo.', contoh: 'Setiap simbol pada lambang merepresentasikan identitas himpunan.' },
  { key: 'sambutan', label: 'Sambutan', hint: 'Narasi tentang kabinet aktif, tampil di blok Struktur.', contoh: 'Adhikara Karsa mencerminkan amanah dan tekad kepengurusan.' },
  { key: 'visi', label: 'Visi', hint: 'Butir visi, satu butir satu kalimat.', contoh: 'Kemandirian dan profesionalisme mahasiswa Teknik Pertambangan.' },
  { key: 'misi', label: 'Misi', hint: 'Butir misi, satu butir satu kalimat.', contoh: 'Mengembangkan potensi anggota melalui pelatihan teknis.' },
]

export default function ProfileTab({ showToast }: Props) {
  const [items, setItems] = useState<ProfileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState<ProfileType>('sejarah')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await getProfileItems())
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal memuat data profil'), 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadData()
  }, [loadData])

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
      showToast(pesanError(e, 'Gagal menyimpan profil'), 'error')
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
      showToast(pesanError(e, 'Gagal menghapus item'), 'error')
    }
  }

  const filtered = items.filter((i) => i.type === activeType)
  const aktif = JENIS.find((j) => j.key === activeType) ?? JENIS[0]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-poppins text-white">Konten Profil & Narasi</h2>
        <p className="text-xs text-gray-400 mt-1">{aktif.hint}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {JENIS.map((j) => (
          <button
            key={j.key}
            type="button"
            onClick={() => { setActiveType(j.key); setEditingId(null); setContent('') }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              activeType === j.key
                ? 'bg-primary text-black border-primary'
                : 'bg-white/5 text-gray-300 border-white/10 hover:text-white'
            }`}
          >
            {j.label}
          </button>
        ))}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300" htmlFor="field-profiletab-1">
          {editingId ? `✏️ Ubah ${aktif.label}` : `➕ Tambah ${aktif.label}`}
        </label>
        <textarea
          id="field-profiletab-1"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={aktif.contoh}
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
          <TombolSimpan submitting={submitting} disabled={!content.trim()} />
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <TableSkeleton rows={4} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-500">Belum ada isi untuk {aktif.label}. Halaman depan memakai teks bawaan.</div>
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
