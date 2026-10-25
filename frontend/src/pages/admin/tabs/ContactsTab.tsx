import { useState, useEffect } from 'react'
import { getContact, updateContact, pesanError } from '../../../services/api'
import TableSkeleton from '../../../components/admin/TableSkeleton'
import type { Contact } from '../../../types'

interface Props {
  showToast: (msg: string) => void
}

const FIELDS: { key: keyof Contact; label: string; placeholder: string; type?: string }[] = [
  { key: 'email', label: 'Email Resmi', placeholder: 'hmtp.adhikarakarsa@gmail.com', type: 'email' },
  { key: 'website', label: 'Website', placeholder: 'https://hmtpunisba.com' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/hmtpunisba' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@hmtpunisba' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@hmtpunisba' },
]

export default function ContactsTab({ showToast }: Props) {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    website: '',
    instagram: '',
    tiktok: '',
    youtube: '',
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getContact()
      if (data) {
        setFormData({
          email: data.email || '',
          website: data.website || '',
          instagram: data.instagram || '',
          tiktok: data.tiktok || '',
          youtube: data.youtube || '',
        })
      }
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal memuat kontak organisasi'))
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
      await updateContact(formData)
      showToast('Informasi kontak & medsos berhasil disimpan')
      loadData()
    } catch (e) {
      console.error(e)
      showToast(pesanError(e, 'Gagal menyimpan kontak'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold font-poppins text-white">Kelola Kontak & Media Sosial</h2>
        <p className="text-xs text-gray-400 mt-1">
          Informasi yang tampil di footer halaman publik serta saluran komunikasi resmi HMTP UNISBA.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={3} />
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-gray-300">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  required={f.key === 'email'}
                  value={formData[f.key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-primary hover:bg-dark-gold text-black transition-all disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan Kontak'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
