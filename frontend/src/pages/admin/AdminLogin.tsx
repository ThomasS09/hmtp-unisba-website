import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginAdmin } from '../../services/api'
import logo from '../../assets/logo.jpg'

interface LoginFormData {
  email: string
  password: string
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      await loginAdmin(formData)
      navigate('/admin/dashboard')
    } catch (err: unknown) {
      const errorWithResponse = err as { response?: { data?: { message?: string; errors?: { email?: string[] } } } }
      const serverMsg = errorWithResponse?.response?.data?.message || errorWithResponse?.response?.data?.errors?.email?.[0]
      setErrorMessage(
        serverMsg || 'Gagal login. Pastikan email dan password sudah sesuai.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-primary selection:text-black">
      {/* Background radial glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-inter text-gray-400 hover:text-primary transition-colors"
          >
            <span>&larr;</span> Kembali ke Website Utama
          </Link>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-block relative mb-4">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-md animate-pulse"></div>
              <img
                src={logo}
                alt="Logo HMTP UNISBA"
                className="relative h-16 w-16 mx-auto rounded-full border-2 border-primary object-cover shadow-lg"
              />
            </div>
            <h1 className="font-poppins font-black text-2xl text-white tracking-tight">
              Portal Admin <span className="text-primary">HMTP</span>
            </h1>
            <p className="font-inter text-xs text-gray-400 mt-1.5">
              Himpunan Mahasiswa Teknik Pertambangan UNISBA
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-inter flex items-start gap-2.5">
              <span className="text-base leading-none">⚠️</span>
              <div>
                <strong className="block font-semibold">Autentikasi Gagal</strong>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block font-inter text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 pl-1">
                Email Administrator
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="admin-email"
                  name="email"
                  required
                  placeholder="admin@hmtpunisba.or.id"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-inter text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 pl-1">
                <label htmlFor="admin-password" className="font-inter text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-inter text-gray-400 hover:text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-password"
                name="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-inter text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-primary text-black font-poppins font-bold text-sm tracking-wide hover:bg-yellow-400 hover:shadow-[0_0_25px_rgba(255,212,0,0.4)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </form>

          {/* Panduan singkat login */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-center font-inter text-[11px] text-gray-500">
              Akun pengurus dikelola di dashboard. Hubungi admin HMTP bila lupa password.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center font-inter text-[11px] text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} HMTP UNISBA &bull; Adhikara Karsa Cabinet
        </p>
      </div>
    </div>
  )
}
