import { useState } from 'react'
import { changeAdminPassword, pesanError } from '../../../services/api'

interface Props {
  showToast: (msg: string) => void
}

/**
 * Tab "Akun": ganti password admin yang sedang login.
 * Password lama diminta supaya token yang dicuri tidak bisa mengunci pemilik akun.
 */
export default function AccountTab({ showToast }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const adminUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user') || '{}')
    } catch {
      return {}
    }
  })()

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})

    try {
      const res = await changeAdminPassword(form)
      showToast(res.message || 'Password berhasil diganti')
      setForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { errors?: Record<string, string[]> } } })?.response?.data?.errors
      if (detail) setErrors(Object.fromEntries(Object.entries(detail).map(([k, v]) => [k, v[0]])))
      showToast(pesanError(err, 'Gagal mengganti password'))
    } finally {
      setSubmitting(false)
    }
  }

  const FIELDS: { key: keyof typeof form; label: string; hint?: string }[] = [
    { key: 'current_password', label: 'Password Lama' },
    { key: 'password', label: 'Password Baru', hint: 'Minimal 8 karakter' },
    { key: 'password_confirmation', label: 'Ulangi Password Baru' },
  ]

  const inputClass =
    'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-primary/50 focus:outline-none'

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold font-poppins text-white">Akun & Password</h2>
        <p className="text-xs text-gray-400 mt-1">
          Akun yang dipakai mengelola website HMTP UNISBA. Ganti password bawaan sebelum website dipakai pengurus.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
        <span className="text-xs font-semibold uppercase text-gray-300">Akun Aktif</span>
        <p className="text-sm text-white">{adminUser.name || 'Administrator'}</p>
        <p className="text-xs text-gray-400">{adminUser.email || '-'}</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <label htmlFor={f.key} className="text-xs font-semibold uppercase text-gray-300">
                {f.label}
              </label>
              <input
                id={f.key}
                type="password"
                required
                autoComplete="new-password"
                value={form[f.key]}
                onChange={set(f.key)}
                className={inputClass}
              />
              {errors[f.key] ? (
                <p className="text-[11px] text-red-400">{errors[f.key]}</p>
              ) : f.hint ? (
                <p className="text-[11px] text-gray-500">{f.hint}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-primary hover:bg-dark-gold text-black transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </div>
      </form>
    </div>
  )
}
