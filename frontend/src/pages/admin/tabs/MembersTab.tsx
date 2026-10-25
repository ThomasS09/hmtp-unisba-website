import { useState, useEffect, useRef } from 'react'
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getDepartments,
  getCabinets, pesanError } from '../../../services/api'
import TableSkeleton from '../../../components/admin/TableSkeleton'
import type { Member, Department, Cabinet } from '../../../types'

interface Props {
  showToast: (msg: string) => void
}

export default function MembersTab({ showToast }: Props) {
  const [members, setMembers] = useState<Member[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [activeCabinetId, setActiveCabinetId] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [filterKelompok, setFilterKelompok] = useState<'Semua' | 'Pengurus Inti' | 'Ketua Bidang'>('Semua')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    kelompok: 'Pengurus Inti' as 'Pengurus Inti' | 'Ketua Bidang',
    position: '',
    name: '',
    npm: '',
    department_id: '' as string | number,
    sort_order: 0,
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const [mList, dList, cList] = await Promise.all([
        getMembers(),
        getDepartments(),
        getCabinets(),
      ])
      setMembers(mList)
      setDepartments(dList)
      const activeCab = cList.find((c: Cabinet) => c.is_active) ?? cList[0]
      if (activeCab) setActiveCabinetId(activeCab.id)
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal memuat data pengurus'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      kelompok: 'Pengurus Inti',
      position: '',
      name: '',
      npm: '',
      department_id: '',
      sort_order: 0,
    })
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleEdit = (m: Member) => {
    setEditingId(m.id)
    setFormData({
      kelompok: m.kelompok,
      position: m.position,
      name: m.name,
      npm: m.npm || '',
      department_id: m.department_id ?? '',
      sort_order: m.sort_order ?? 0,
    })
    setPhotoFile(null)
    setPhotoPreview(m.photo_url || null)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.position.trim()) return
    setSubmitting(true)
    try {
      const payload: Partial<Member> = {
        name: formData.name.trim(),
        position: formData.position.trim(),
        npm: formData.npm.trim() || undefined,
        kelompok: formData.kelompok,
        department_id: formData.department_id ? Number(formData.department_id) : null,
        cabinet_id: activeCabinetId,
        sort_order: Number(formData.sort_order) || 0,
      }

      if (editingId) {
        await updateMember(editingId, payload, photoFile)
        showToast('Data pengurus berhasil diperbarui')
      } else {
        await createMember(payload, photoFile)
        showToast('Pengurus baru berhasil ditambahkan')
      }
      resetForm()
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menyimpan pengurus'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data pengurus ini?')) return
    try {
      await deleteMember(id)
      showToast('Pengurus berhasil dihapus')
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menghapus pengurus'))
    }
  }

  const filteredMembers = members.filter((m) =>
    filterKelompok === 'Semua' ? true : m.kelompok === filterKelompok
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-poppins text-white">Kelola Pengurus</h2>
          <p className="text-xs text-gray-400 mt-1">
            Data foto, jabatan, dan NPM pengurus (NPM hanya terlihat di dashboard admin).
          </p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          {(['Semua', 'Pengurus Inti', 'Ketua Bidang'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilterKelompok(k)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterKelompok === k ? 'bg-primary text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
          {editingId ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase">Kelompok</label>
            <select
              value={formData.kelompok}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kelompok: e.target.value as 'Pengurus Inti' | 'Ketua Bidang',
                })
              }
              className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            >
              <option value="Pengurus Inti">Pengurus Inti</option>
              <option value="Ketua Bidang">Ketua Bidang</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase">Bidang (Opsional)</label>
            <select
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            >
              <option value="">-- Tanpa Bidang / Inti --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase">Jabatan</label>
            <input
              type="text"
              required
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Contoh: Ketua Umum"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase">Nama Lengkap</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nama pengurus..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase flex items-center gap-1.5">
              <span>NPM</span>
              <span className="text-[10px] text-amber-400 font-normal lowercase">(hanya di dashboard)</span>
            </label>
            <input
              type="text"
              value={formData.npm}
              onChange={(e) => setFormData({ ...formData, npm: e.target.value })}
              placeholder="100701..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase">Urutan Tampil</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Upload Foto */}
        <div className="flex items-center gap-4 pt-2">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover object-top border-2 border-primary/50"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-500">
              No foto
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 uppercase block">Unggah Foto Pengurus</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-black hover:file:bg-dark-gold cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
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
            {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Pengurus'}
          </button>
        </div>
      </form>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <TableSkeleton rows={3} className="col-span-full" />
        ) : filteredMembers.length === 0 ? (
          <div className="col-span-full text-center py-10 text-xs text-gray-500">Belum ada pengurus.</div>
        ) : (
          filteredMembers.map((m) => (
            <div
              key={m.id}
              className="glass-panel p-4 rounded-xl border border-white/10 flex items-start gap-4"
            >
              {m.photo_url ? (
                <img
                  src={m.photo_url}
                  alt={m.name}
                  className="w-14 h-14 rounded-full object-cover object-top border border-primary/40 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {m.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{m.name}</p>
                <p className="text-[11px] text-primary font-semibold truncate">{m.position}</p>
                {m.npm && (
                  <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                    NPM: {m.npm}
                  </p>
                )}
                {m.department && (
                  <p className="text-[10px] text-gray-400 truncate">{m.department}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(m)}
                    className="px-2.5 py-1 text-[10px] font-semibold rounded bg-white/5 hover:bg-primary/20 text-gray-200 hover:text-primary transition-all"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className="px-2.5 py-1 text-[10px] font-semibold rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
