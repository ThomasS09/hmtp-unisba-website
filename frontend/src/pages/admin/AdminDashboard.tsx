import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  logoutAdmin,
  getAspirations,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  updateAspirationStatus,
  deleteAspiration,
  pesanError,
} from '../../services/api'
import logo from '../../assets/logo.jpg'

// Sama dengan News::CATEGORIES di backend.
const KATEGORI_BERITA = ['Kegiatan', 'Prestasi', 'Akademik', 'Sosial', 'Pengumuman', 'Organisasi', 'Lainnya']
import type { Aspiration, NewsArticle, NewsInput, AspirationStatus } from '../../types'
import ProfileTab from './tabs/ProfileTab'
import CabinetTab from './tabs/CabinetTab'
import DepartmentsTab from './tabs/DepartmentsTab'
import MembersTab from './tabs/MembersTab'
import ProgramsTab from './tabs/ProgramsTab'
import ContactsTab from './tabs/ContactsTab'
import AccountTab from './tabs/AccountTab'
import OverviewTab from './tabs/OverviewTab'
import AspirationsTab from './tabs/AspirationsTab'
import TombolSimpan from '../../components/admin/TombolSimpan'
import NewsTab from './tabs/NewsTab'

interface AdminUser {
  name: string
  email: string
  role?: string
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'cabinet' | 'departments' | 'members' | 'programs' | 'contacts' | 'aspirations' | 'news' | 'account'
  >('overview')
  
  // Data State
  const [aspirations, setAspirations] = useState<Aspiration[]>([])
  const [newsList, setNewsList] = useState<NewsArticle[]>([])
  const [backendOnline, setBackendOnline] = useState(false)
  const [adminUser] = useState<AdminUser>(() => {
    const stored = localStorage.getItem('admin_user')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return { name: 'Admin HMTP', email: 'admin@hmtpunisba.or.id' }
      }
    }
    return { name: 'Admin HMTP', email: 'admin@hmtpunisba.or.id' }
  })

  // Modals
  const [selectedAspiration, setSelectedAspiration] = useState<Aspiration | null>(null)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null)
  const [newsFormData, setNewsFormData] = useState<NewsInput>({
    title: '',
    category: 'Kegiatan',
    author: 'Humas HMTP',
    excerpt: '',
    content: '',
  })
  const [newsSubmitting, setNewsSubmitting] = useState(false)

  // Fokus modal: dikembalikan ke tombol pemicu saat modal ditutup
  const modalAspirasiTutupRef = useRef<HTMLButtonElement | null>(null)
  const modalBeritaTutupRef = useRef<HTMLButtonElement | null>(null)
  const pemicuModalRef = useRef<HTMLElement | null>(null)

  const bukaDetail = (item: Aspiration, e: React.MouseEvent<HTMLElement>) => {
    pemicuModalRef.current = e.currentTarget
    setSelectedAspiration(item)
  }

  const tutupModal = () => {
    setSelectedAspiration(null)
    setIsNewsModalOpen(false)
    pemicuModalRef.current?.focus()
  }

  // Escape menutup modal yang sedang terbuka
  useEffect(() => {
    if (!selectedAspiration && !isNewsModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') tutupModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedAspiration, isNewsModalOpen])

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState('')
  const [toastError, setToastError] = useState(false)

  // Pesan galat bertahan lebih lama + warna merah, supaya tidak terkecoh
  // notifikasi sukses yang tampil sama.
  const showToast = (msg: string, jenis: 'ok' | 'error' = 'ok') => {
    const gagal = jenis === 'error'
    setToastError(gagal)
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), gagal ? 7000 : 3000)
  }

  // Fokus pindah ke tombol tutup begitu modal terbuka (pengguna keyboard tidak tersesat)
  useEffect(() => {
    if (selectedAspiration) modalAspirasiTutupRef.current?.focus()
  }, [selectedAspiration])

  useEffect(() => {
    if (isNewsModalOpen) modalBeritaTutupRef.current?.focus()
  }, [isNewsModalOpen])

  // Fetch initial data: dua permintaan paralel, bukan berurutan.
  // Status "API Online" diambil dari hasil permintaan itu sendiri, jadi tidak
  // ada lagi request health-check terpisah yang bisa berbeda kesimpulan.
  const fetchData = useCallback(async () => {
    const [aspRes, newsRes] = await Promise.allSettled([
      getAspirations({ per_page: 100 }),
      getNews({ per_page: 100 }),
    ])

    setBackendOnline(aspRes.status === 'fulfilled' && newsRes.status === 'fulfilled')

    if (aspRes.status === 'fulfilled') {
      setAspirations(Array.isArray(aspRes.value) ? aspRes.value : [])
    } else {
      setAspirations([])
      showToast(pesanError(aspRes.reason, 'Gagal memuat aspirasi. Coba refresh.'), 'error')
    }

    if (newsRes.status === 'fulfilled') {
      setNewsList(Array.isArray(newsRes.value) ? newsRes.value : [])
    } else {
      setNewsList([])
      showToast(pesanError(newsRes.reason, 'Gagal memuat berita. Coba refresh.'), 'error')
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle Logout
  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/admin/login')
  }

  // Aspirations Management
  const handleToggleAspirationStatus = async (item: Aspiration) => {
    const newStatus: AspirationStatus = item.status === 'Selesai' ? 'Pending' : 'Selesai'
    try {
      if (backendOnline) {
        await updateAspirationStatus(item.id, newStatus)
      }
      setAspirations((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, status: newStatus } : a))
      )
      showToast(`Status aspirasi berhasil diubah ke: ${newStatus}`)
    } catch (e) {
      // Gagal di server: kembalikan tampilan ke status lama, jangan pura-pura berhasil
      setAspirations((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, status: item.status } : a))
      )
      showToast(pesanError(e, `Gagal mengubah status aspirasi ke ${newStatus}`), 'error')
    }
  }

  const handleDeleteAspiration = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus aspirasi ini dari daftar?')) return
    try {
      if (backendOnline) {
        await deleteAspiration(id)
      }
      setAspirations((prev) => prev.filter((a) => a.id !== id))
      if (selectedAspiration?.id === id) setSelectedAspiration(null)
      showToast('Aspirasi berhasil dihapus.')
    } catch (e) {
      showToast(pesanError(e, 'Gagal menghapus aspirasi'), 'error')
    }
  }

  // Export seluruh aspirasi; API membatasi tiap halaman maksimal 100 baris.
  const exportAspirationsCSV = async () => {
    try {
      const semua = [] as Aspiration[]
      let page = 1
      while (true) {
        const batch = await getAspirations({ per_page: 100, page })
        semua.push(...batch)
        if (batch.length < 100) break
        page += 1
      }

      const headers = ['ID', 'Nama', 'NIM', 'Kategori', 'Status', 'Tanggal', 'Pesan']
      const csvField = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`
      const rows = semua.map((a) => [
        a.id,
        a.name,
        a.nim,
        a.category,
        a.status,
        new Date(a.created_at || Date.now()).toLocaleDateString('id-ID'),
        a.message,
      ].map(csvField).join(','))
      // BOM + CRLF dibentuk dari kode karakter supaya Excel membaca UTF-8 dengan benar
      const BOM = String.fromCharCode(0xfeff)
      const BARIS = String.fromCharCode(13, 10)
      const csv = BOM + [headers.map(csvField).join(','), ...rows].join(BARIS)
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `aspirasi-hmtp-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      showToast(`Unduh CSV selesai: ${semua.length} aspirasi.`)
    } catch (e) {
      showToast(pesanError(e, 'Gagal mengekspor aspirasi.'), 'error')
    }
  }

  // News Management
  const openCreateNewsModal = () => {
    setEditingNews(null)
    setNewsFormData({
      title: '',
      category: 'Kegiatan',
      author: 'Humas HMTP',
      excerpt: '',
      content: '',
    })
    setIsNewsModalOpen(true)
  }

  const openEditNewsModal = (article: NewsArticle) => {
    setEditingNews(article)
    setNewsFormData({
      title: article.title || '',
      category: article.category || 'Kegiatan',
      author: article.author || 'Humas HMTP',
      excerpt: article.excerpt || '',
      content: article.content || '',
    })
    setIsNewsModalOpen(true)
  }

  const handleSaveNews = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newsSubmitting) return
    setNewsSubmitting(true)
    try {
      if (editingNews) {
        if (backendOnline) {
          await updateNews(editingNews.id, newsFormData)
        }
        setNewsList((prev) =>
          prev.map((n) => (n.id === editingNews.id ? { ...n, ...newsFormData } : n))
        )
        showToast('Berita berhasil diperbarui!')
      } else {
        let created
        if (backendOnline) {
          created = await createNews(newsFormData)
        }
        const newEntry: NewsArticle = created?.data || {
          id: Date.now(),
          ...newsFormData,
          created_at: new Date().toISOString(),
        }
        setNewsList((prev) => [newEntry, ...prev])
        showToast('Berita baru berhasil ditambahkan!')
      }
      setIsNewsModalOpen(false)
    } catch (e) {
      showToast(pesanError(e, 'Gagal menyimpan berita'), 'error')
    } finally {
      setNewsSubmitting(false)
    }
  }

  const handleDeleteNews = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus artikel berita ini?')) return
    try {
      if (backendOnline) {
        await deleteNews(id)
      }
      setNewsList((prev) => prev.filter((n) => n.id !== id))
      showToast('Berita berhasil dihapus.')
    } catch (e) {
      showToast(pesanError(e, 'Gagal menghapus berita'), 'error')
    }
  }

  // Stats
  const totalAspirations = aspirations.length
  const pendingAspirations = aspirations.filter((a) => a.status === 'Pending').length
  const completedAspirations = aspirations.filter((a) => a.status === 'Selesai').length
  const totalNews = newsList.length
  const aspirationCompletionRate = totalAspirations > 0 ? Math.round((completedAspirations / totalAspirations) * 100) : 0
  
  // News category breakdown
  const newsCategoryStats = {
    Kegiatan: newsList.filter((n) => n.category === 'Kegiatan').length,
    Prestasi: newsList.filter((n) => n.category === 'Prestasi').length,
    Akademik: newsList.filter((n) => n.category === 'Akademik').length,
    Sosial: newsList.filter((n) => n.category === 'Sosial').length,
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col font-inter selection:bg-primary selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl font-semibold text-xs shadow-2xl animate-fade-in flex items-center gap-2 max-w-sm ${
            toastError
              ? 'bg-red-500/95 text-white border border-red-300/40'
              : 'bg-primary text-black'
          }`}
        >
          <span>{toastError ? '⚠️' : '✅'}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo HMTP"
              className="w-10 h-10 rounded-full border border-primary/50 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-poppins font-black text-lg tracking-tight text-white">
                  HMTP <span className="text-primary">ADMIN</span>
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    backendOnline
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}
                  title={backendOnline ? 'Laravel API Terhubung' : 'Server Laravel Belum Terhubung (Mode Demonstrasi/Lokal)'}
                >
                  {backendOnline ? '● API Online' : '○ Mode Demo / Menunggu API'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Kabinet Adhikara Karsa</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="text-xs text-gray-300 hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-primary/30"
            >
              <span>🌐</span>
              <span className="hidden sm:inline">Lihat Web</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/10 text-xs text-gray-400">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs">
                {adminUser?.name?.[0] || 'A'}
              </div>
              <div className="text-left">
                <span className="text-white font-medium block text-xs leading-none">
                  {adminUser?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-gray-500 leading-tight">Superadmin</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl font-poppins font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-primary text-black shadow-lg shadow-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📊</span> Ringkasan
          </button>
          <button
            onClick={() => setActiveTab('aspirations')}
            className={`px-4 py-2.5 rounded-xl font-poppins font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'aspirations'
                ? 'bg-primary text-black shadow-lg shadow-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📬</span> Kotak Aspirasi
            {pendingAspirations > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'aspirations'
                    ? 'bg-black text-primary'
                    : 'bg-primary text-black'
                }`}
              >
                {pendingAspirations}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2.5 rounded-xl font-poppins font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'news'
                ? 'bg-primary text-black shadow-lg shadow-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📰</span> Kelola Berita & Artikel
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'news'
                  ? 'bg-black text-primary'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              {totalNews}
            </span>
          </button>

          {(
            [
              ['profile', '🏛️', 'Profil & Visi Misi'],
              ['cabinet', '⚙️', 'Kabinet'],
              ['departments', '🧩', 'Bidang'],
              ['members', '👥', 'Pengurus'],
              ['programs', '📋', 'Proker & Aker'],
              ['contacts', '🔗', 'Kontak & Medsos'],
              ['account', '🔑', 'Akun'],
            ] as const
          ).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2.5 rounded-xl font-poppins font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === key
                  ? 'bg-primary text-black shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{icon}</span> {label}
            </button>
          ))}

          <button
            onClick={fetchData}
            title="Muat ulang data"
            className="ml-auto text-xs text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            🔄 Refresh
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <OverviewTab
            totalAspirations={totalAspirations}
            pendingAspirations={pendingAspirations}
            aspirationCompletionRate={aspirationCompletionRate}
            newsCategoryStats={newsCategoryStats}
            totalNews={totalNews}
            backendOnline={backendOnline}
            aspirations={aspirations}
            newsList={newsList}
            onTab={setActiveTab}
            onDetail={bukaDetail}
            onEditNews={(item, e) => {
              pemicuModalRef.current = e.currentTarget
              openEditNewsModal(item)
            }}
          />
        )}

        {/* TAB 2: ASPIRASI MAHASISWA */}
        {activeTab === 'aspirations' && (
          <AspirationsTab
            aspirations={aspirations}
            onExport={exportAspirationsCSV}
            onDetail={bukaDetail}
            onToggleStatus={handleToggleAspirationStatus}
            onDelete={handleDeleteAspiration}
          />
        )}

        {/* TAB 3: KELOLA BERITA */}
        {activeTab === 'news' && (
          <NewsTab
            newsList={newsList}
            onCreate={(e) => {
              pemicuModalRef.current = e.currentTarget
              openCreateNewsModal()
            }}
            onEdit={(item, e) => {
              pemicuModalRef.current = e.currentTarget
              openEditNewsModal(item)
            }}
            onDelete={handleDeleteNews}
          />
        )}

        {activeTab === 'profile' && <ProfileTab showToast={showToast} />}
        {activeTab === 'cabinet' && <CabinetTab showToast={showToast} />}
        {activeTab === 'departments' && <DepartmentsTab showToast={showToast} />}
        {activeTab === 'members' && <MembersTab showToast={showToast} />}
        {activeTab === 'programs' && <ProgramsTab showToast={showToast} />}
        {activeTab === 'contacts' && <ContactsTab showToast={showToast} />}
        {activeTab === 'account' && <AccountTab showToast={showToast} />}
      </main>

      {/* MODAL: DETAIL ASPIRASI */}
      {selectedAspiration && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={tutupModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-modal-aspirasi"
            onClick={(e) => e.stopPropagation()}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <span id="judul-modal-aspirasi" className="font-poppins font-bold text-base text-white">
                Detail Pesan Aspirasi
              </span>
              <button
                type="button"
                ref={modalAspirasiTutupRef}
                onClick={tutupModal}
                aria-label="Tutup detail aspirasi"
                className="text-gray-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-inter">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Nama Mahasiswa</span>
                  <span className="font-semibold text-white">{selectedAspiration.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">NIM</span>
                  <span className="font-semibold text-white">{selectedAspiration.nim || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Kategori</span>
                  <span className="font-semibold text-primary">{selectedAspiration.category}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Status</span>
                  <span className="font-semibold text-white">{selectedAspiration.status || 'Pending'}</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 block text-[10px] uppercase mb-1.5 font-semibold" htmlFor="field-admindashboard-1">Isi Pesan:</label>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedAspiration.message}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleToggleAspirationStatus(selectedAspiration)}
                  className="px-4 py-2 rounded-xl bg-primary text-black font-semibold text-xs hover:bg-yellow-400 transition-colors cursor-pointer"
                >
                  {selectedAspiration.status === 'Selesai'
                    ? 'Kembalikan ke Pending'
                    : 'Tandai Sudah Diproses (Selesai)'}
                </button>
                <button
                  type="button"
                  onClick={tutupModal}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 font-semibold text-xs hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT BERITA */}
      {isNewsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={tutupModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-modal-berita"
            onClick={(e) => e.stopPropagation()}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 max-w-xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <span id="judul-modal-berita" className="font-poppins font-bold text-base text-white">
                {editingNews ? '✏️ Ubah Artikel Berita' : '➕ Tulis Berita Baru'}
              </span>
              <button
                type="button"
                ref={modalBeritaTutupRef}
                onClick={tutupModal}
                aria-label="Tutup formulir berita"
                className="text-gray-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4 text-xs font-inter">
              <div>
                <label htmlFor="field-admindashboard-1" className="block text-gray-300 font-semibold mb-1">
                  Judul Artikel
                </label>
                <input
                  id="field-admindashboard-1"
                  type="text"
                  required
                  placeholder="Contoh: Kunjungan Industri Tambang 2026..."
                  value={newsFormData.title}
                  onChange={(e) => setNewsFormData({ ...newsFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1" htmlFor="field-admindashboard-2">Kategori</label>
                  <select
                    id="field-admindashboard-2"
                    value={newsFormData.category}
                    onChange={(e) => setNewsFormData({ ...newsFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary"
                  >
                    {KATEGORI_BERITA.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1" htmlFor="field-admindashboard-3">Penulis / Departemen</label>
                  <input
                    id="field-admindashboard-3"
                    type="text"
                    required
                    value={newsFormData.author}
                    onChange={(e) => setNewsFormData({ ...newsFormData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1" htmlFor="field-admindashboard-4">Ringkasan / Excerpt</label>
                <textarea
                  id="field-admindashboard-4"
                  rows={2}
                  required
                  placeholder="Ringkasan singkat yang muncul di kartu depan..."
                  value={newsFormData.excerpt}
                  onChange={(e) => setNewsFormData({ ...newsFormData, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1" htmlFor="field-admindashboard-5">Isi Artikel Lengkap</label>
                <textarea
                  id="field-admindashboard-5"
                  rows={5}
                  required
                  placeholder="Tuliskan isi berita, detail kegiatan, hasil kompetisi, dll..."
                  value={newsFormData.content}
                  onChange={(e) => setNewsFormData({ ...newsFormData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 font-semibold text-xs hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <TombolSimpan submitting={newsSubmitting} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}