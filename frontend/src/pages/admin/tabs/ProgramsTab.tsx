import { useState, useEffect, useRef } from 'react'
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  getDepartments,
  getCabinets, pesanError } from '../../../services/api'
import TableSkeleton from '../../../components/admin/TableSkeleton'
import type { Program, Department, Cabinet } from '../../../types'

interface Props {
  showToast: (msg: string) => void
}

const TYPE_OPTIONS = ['Program Kerja', 'Aktivitas Kerja'] as const
const STATUS_OPTIONS = ['Rencana', 'Berjalan', 'Selesai'] as const

export default function ProgramsTab({ showToast }: Props) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [activeCabinetId, setActiveCabinetId] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [filterDept, setFilterDept] = useState<string>('Semua')
  const [filterType, setFilterType] = useState<string>('Semua')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    department_id: '' as string | number,
    type: 'Program Kerja' as (typeof TYPE_OPTIONS)[number],
    status: 'Rencana' as (typeof STATUS_OPTIONS)[number],
    description: '',
    schedule: '',
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const [pList, dList, cList] = await Promise.all([
        getPrograms(),
        getDepartments(),
        getCabinets(),
      ])
      setPrograms(pList)
      setDepartments(dList)
      const activeCab = cList.find((c: Cabinet) => c.is_active) ?? cList[0]
      if (activeCab) setActiveCabinetId(activeCab.id)
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal memuat data program kerja'))
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
      name: '',
      department_id: '',
      type: 'Program Kerja',
      status: 'Rencana',
      description: '',
      schedule: '',
    })
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleEdit = (p: Program) => {
    setEditingId(p.id)
    setFormData({
      name: p.name,
      department_id: p.department_id ?? '',
      type: p.type,
      status: p.status ?? 'Rencana',
      description: p.description || '',
      schedule: p.schedule || '',
    })
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.department_id || !activeCabinetId) {
      showToast('Nama program, bidang, dan kabinet aktif wajib tersedia')
      return
    }
    setSubmitting(true)
    try {
      const payload: Partial<Program> = {
        name: formData.name.trim(),
        department_id: Number(formData.department_id),
        cabinet_id: activeCabinetId,
        type: formData.type,
        status: formData.status,
        description: formData.description.trim() || undefined,
        schedule: formData.schedule.trim() || undefined,
      }

      if (editingId) {
        await updateProgram(editingId, payload, imageFile)
        showToast('Program berhasil diperbarui')
      } else {
        await createProgram(payload, imageFile)
        showToast('Program baru berhasil ditambahkan')
      }
      resetForm()
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menyimpan program'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus program kerja ini?')) return
    try {
      await deleteProgram(id)
      showToast('Program berhasil dihapus')
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menghapus program'))
    }
  }

  const filteredPrograms = programs.filter((p) => {
    if (filterType !== 'Semua' && p.type !== filterType) return false
    if (filterDept !== 'Semua' && String(p.department_id) !== filterDept) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-poppins text-white">Kelola Program & Agenda Kerja</h2>
          <p className="text-xs text-gray-400 mt-1">
            Daftar seluruh proker dan aker per bidang (total {programs.length} item).
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
          >
            <option value="Semua">Semua Jenis</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
          >
            <option value="Semua">Semua Bidang</option>
            {departments.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
          {editingId ? 'Edit Proker/Aker' : 'Tambah Proker/Aker Baru'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase">Nama Program / Agenda</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Musyawarah Mahasiswa (MUMAS)"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase">Bidang</label>
            <select
              required
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            >
              <option value="">-- Pilih Bidang --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase">Jenis</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as (typeof TYPE_OPTIONS)[number] })
              }
              className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as (typeof STATUS_OPTIONS)[number] })
              }
              className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase">Jadwal / Waktu</label>
            <input
              type="text"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="Contoh: Maret 2027"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase">Deskripsi</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Uraian singkat program/agenda kerja..."
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase">Lampiran Gambar (Opsional)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-black hover:file:bg-dark-gold cursor-pointer"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
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
            {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Program'}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {loading ? (
          <TableSkeleton rows={4} />
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-500">Belum ada program kerja.</div>
        ) : (
          filteredPrograms.map((p) => (
            <div
              key={p.id}
              className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.type === 'Program Kerja'
                        ? 'bg-primary/20 text-primary border border-primary/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    {p.type}
                  </span>
                  <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    {p.department || 'Umum'}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                      p.status === 'Selesai'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : p.status === 'Berjalan'
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-gray-400 bg-white/5'
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.schedule && <span className="text-[10px] text-gray-400">{p.schedule}</span>}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white">{p.name}</p>
                {p.description && <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-primary/20 text-gray-200 hover:text-primary transition-all"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
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
