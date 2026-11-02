import { useState, useEffect, useCallback } from 'react'
import { getProfileItems, createProfileItem, updateProfileItem, deleteProfileItem, pesanError } from '../../../services/api'
import TableSkeleton from '../../../components/admin/TableSkeleton'
import TombolSimpan from '../../../components/admin/TombolSimpan'
import type { ProfileItem, ProfileType } from '../../../types'

interface Props {
  showToast: (msg: string, jenis?: 'ok' | 'error') => void
}

type FieldKey = 'heading' | 'subheading' | 'note' | 'body'

interface FieldDef {
  key: FieldKey
  label: string
  placeholder: string
  rows: number
  wajib?: boolean
}

interface JenisDef {
  key: ProfileType
  label: string
  hint: string
  fields: FieldDef[]
  // Kata pengantar di daftar butir, mis. "Tahun" / "Elemen".
  kolomKecil?: string
}

const KOSONG: Record<FieldKey, string> = { heading: '', subheading: '', note: '', body: '' }

// Satu tabel konfigurasi: menentukan field apa saja yang muncul untuk setiap
// jenis butir. Tambah jenis baru = tambah satu entri di sini.
const JENIS: JenisDef[] = [
  {
    key: 'sejarah',
    label: 'Sejarah',
    hint: 'Paragraf pembuka blok Sejarah di halaman depan.',
    fields: [{ key: 'body', label: 'Paragraf', rows: 4, wajib: true, placeholder: 'Menelusuri sejarah panjang berdirinya HMTP UNISBA sejak 1983.' }],
  },
  {
    key: 'logo',
    label: 'Arti Logo',
    hint: 'Paragraf pembuka blok Arti Logo.',
    fields: [{ key: 'body', label: 'Paragraf', rows: 4, wajib: true, placeholder: 'Setiap simbol pada lambang merepresentasikan identitas himpunan.' }],
  },
  {
    key: 'sambutan',
    label: 'Sambutan',
    hint: 'Narasi kabinet aktif, tampil di blok Kabinet & Struktur.',
    fields: [{ key: 'body', label: 'Paragraf', rows: 4, wajib: true, placeholder: 'Adhikara Karsa mencerminkan amanah dan tekad kepengurusan.' }],
  },
  {
    key: 'visi',
    label: 'Visi',
    hint: 'Butir visi, satu butir satu kalimat.',
    fields: [{ key: 'body', label: 'Butir Visi', rows: 3, wajib: true, placeholder: 'Kemandirian dan profesionalisme mahasiswa Teknik Pertambangan.' }],
  },
  {
    key: 'misi',
    label: 'Misi',
    hint: 'Butir misi, satu butir satu kalimat.',
    fields: [{ key: 'body', label: 'Butir Misi', rows: 3, wajib: true, placeholder: 'Mengembangkan potensi anggota melalui pelatihan teknis.' }],
  },
  {
    key: 'timeline',
    label: 'Timeline Sejarah',
    hint: 'Kartu-kartu perjalanan sejarah. Urutan tampil mengikuti urutan penyimpanan.',
    kolomKecil: 'Tahun',
    fields: [
      { key: 'heading', label: 'Tahun / Penanda', rows: 1, wajib: true, placeholder: '1983' },
      { key: 'subheading', label: 'Judul Kartu', rows: 1, wajib: true, placeholder: 'Pembentukan & Fondasi Awal' },
      { key: 'note', label: 'Tanggal & Lokasi', rows: 1, placeholder: '19 September 1983 · Kampus UNISBA' },
      { key: 'body', label: 'Deskripsi', rows: 3, wajib: true, placeholder: 'HMTP UNISBA resmi didirikan pada...' },
    ],
  },
  {
    key: 'logo-elemen',
    label: 'Elemen Logo',
    hint: 'Kartu arti lambang. Emoji dipakai sebagai ikon kartu.',
    kolomKecil: 'Ikon',
    fields: [
      { key: 'heading', label: 'Nama Elemen', rows: 1, wajib: true, placeholder: 'Palu dan Belincong' },
      { key: 'note', label: 'Emoji', rows: 1, placeholder: '⚒️' },
      { key: 'body', label: 'Arti', rows: 3, wajib: true, placeholder: 'Disiplin ilmu pertambangan yang menjadi dasar keahlian anggota.' },
    ],
  },
]

export default function ProfileTab({ showToast }: Props) {
  const [items, setItems] = useState<ProfileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState<ProfileType>('sejarah')
  const [form, setForm] = useState<Record<FieldKey, string>>(KOSONG)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const aktif = JENIS.find((j) => j.key === activeType) ?? JENIS[0]

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await getProfileItems())
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal memuat konten profil'), 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const resetForm = () => {
    setForm(KOSONG)
    setEditingId(null)
  }

  const lengkap = aktif.fields.filter((f) => f.wajib).every((f) => form[f.key].trim().length > 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lengkap) return
    setSubmitting(true)
    try {
      const payload = {
        type: activeType,
        heading: form.heading.trim() || undefined,
        subheading: form.subheading.trim() || undefined,
        note: form.note.trim() || undefined,
        body: form.body.trim(),
      }
      if (editingId) {
        await updateProfileItem(editingId, payload)
        showToast(`${aktif.label} berhasil diperbarui`)
      } else {
        await createProfileItem(payload)
        showToast(`${aktif.label} berhasil ditambahkan`)
      }
      resetForm()
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, `Gagal menyimpan ${aktif.label}`), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: ProfileItem) => {
    setEditingId(item.id)
    setActiveType(item.type)
    setForm({
      heading: item.heading ?? '',
      subheading: item.subheading ?? '',
      note: item.note ?? '',
      body: item.body,
    })
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
            onClick={() => { setActiveType(j.key); resetForm() }}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
          {editingId ? `✏️ Ubah ${aktif.label}` : `➕ Tambah ${aktif.label}`}
        </p>

        {aktif.fields.map((f, i) => (
          <div key={f.key} className="space-y-1.5">
            <label
              htmlFor={`field-profiletab-${i + 1}`}
              className="block text-[11px] font-semibold text-gray-400"
            >
              {f.label}{f.wajib ? ' *' : ' (opsional)'}
            </label>
            {f.rows > 1 ? (
              <textarea
                id={`field-profiletab-${i + 1}`}
                rows={f.rows}
                value={form[f.key]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none resize-none"
              />
            ) : (
              <input
                id={`field-profiletab-${i + 1}`}
                type="text"
                value={form[f.key]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
              />
            )}
          </div>
        ))}

        <div className="flex gap-2 justify-end">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
            >
              Batal
            </button>
          )}
          <TombolSimpan submitting={submitting} disabled={!lengkap} />
        </div>
      </form>

      {/* Daftar butir */}
      <div className="space-y-3">
        {loading ? (
          <TableSkeleton rows={4} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-500">
            Belum ada isi untuk {aktif.label}. Halaman depan memakai teks bawaan.
          </div>
        ) : (
          filtered.map((item, idx) => (
            <div
              key={item.id}
              className="glass-panel p-4 rounded-xl border border-white/10 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {aktif.kolomKecil && item.note ? item.note : idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {[item.heading, item.subheading].filter(Boolean).join(' — ') || `Butir ${idx + 1}`}
                  </p>
                  {aktif.kolomKecil && item.note && activeType === 'timeline' && (
                    <p className="text-[11px] text-primary/80 mt-0.5">{item.note}</p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mt-1">{item.body}</p>
                </div>
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
