import { useState, useEffect, type FormEvent } from 'react'
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
  checkHealth,
  pesanError,
} from '../../services/api'
import logo from '../../assets/logo.jpg'
import type { Aspiration, NewsArticle, NewsInput, AspirationStatus } from '../../types'
import ProfileTab from './tabs/ProfileTab'
import CabinetTab from './tabs/CabinetTab'
import DepartmentsTab from './tabs/DepartmentsTab'
import MembersTab from './tabs/MembersTab'
import ProgramsTab from './tabs/ProgramsTab'
import ContactsTab from './tabs/ContactsTab'
import AccountTab from './tabs/AccountTab'

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
  const [_loading, setLoading] = useState(true)
  const [backendOnline, setBackendOnline] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)

  // Pagination for Aspirations
  const [aspirationPage, setAspirationPage] = useState(1)
  const [aspirationPerPage, setAspirationPerPage] = useState(10)

  // Pagination for News
  const [newsPage, setNewsPage] = useState(1)
  const [newsPerPage] = useState(12)

  // Filters
  const [aspirationFilter, setAspirationFilter] = useState('Semua')
  const [aspirationSearch, setAspirationSearch] = useState('')
  const [newsSearch, setNewsSearch] = useState('')
  
  // Sorting
  const [aspirationSort, setAspirationSort] = useState<'newest' | 'oldest' | 'status'>('newest')
  const [newsSort, setNewsSort] = useState<'newest' | 'oldest'>('newest')

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

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Load Admin User from storage
  useEffect(() => {
    const stored = localStorage.getItem('admin_user')
    if (stored) {
      try {
        setAdminUser(JSON.parse(stored))
      } catch {
        setAdminUser({ name: 'Admin HMTP', email: 'admin@hmtpunisba.or.id' })
      }
    } else {
      setAdminUser({ name: 'Admin HMTP', email: 'admin@hmtpunisba.or.id' })
    }
  }, [])

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true)
    try {
      const health = await checkHealth()
      setBackendOnline(health.ok)

      // Aspirasi dari API (tanpa data palsu)
      try {
        const aspData = await getAspirations({ per_page: 100 })
        setAspirations(Array.isArray(aspData) ? aspData : [])
      } catch (e) {
        setAspirations([])
        showToast(pesanError(e, 'Gagal memuat aspirasi. Coba refresh.'))
      }

      // Berita dari API (tanpa data palsu)
      try {
        const newsData = await getNews({ per_page: 100 })
        setNewsList(Array.isArray(newsData) ? newsData : [])
      } catch (e) {
        setNewsList([])
        showToast(pesanError(e, 'Gagal memuat berita. Coba refresh.'))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
      showToast(pesanError(e, `Gagal mengubah status aspirasi ke ${newStatus}`))
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
      showToast(pesanError(e, 'Gagal menghapus aspirasi'))
    }
  }

  // Export Aspirations as CSV
  const exportAspirationsCSV = () => {
    const headers = ['ID', 'Nama', 'NIM', 'Kategori', 'Status', 'Tanggal', 'Pesan']
    const rows = aspirations.map((a) => [
      a.id,
      `"${a.name || ''}"`,
      `"${a.nim || ''}"`,
      `"${a.category || ''}"`,
      `"${a.status || ''}"`,
      `"${new Date(a.created_at || Date.now()).toLocaleDateString('id-ID')}"`,
      `"${(a.message || '').replace(/"/g, '""')}"`,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `aspirasi-hmtp-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('File CSV aspirasi berhasil diunduh!')
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
      showToast(pesanError(e, 'Gagal menyimpan berita'))
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
      showToast(pesanError(e, 'Gagal menghapus berita'))
    }
  }

  // Filtered & Sorted Aspirations
  const getFilteredAndSortedAspirations = () => {
    let filtered = aspirations.filter((item) => {
      const matchCat = aspirationFilter === 'Semua' || item.category === aspirationFilter
      const q = aspirationSearch.toLowerCase()
      const matchSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        (item.nim && item.nim.toLowerCase().includes(q)) ||
        item.message?.toLowerCase().includes(q)
      return matchCat && matchSearch
    })

    // Apply sorting
    if (aspirationSort === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
    } else if (aspirationSort === 'status') {
      filtered.sort((a, b) => {
        if (a.status === b.status) return 0
        return a.status === 'Pending' ? -1 : 1
      })
    } else {
      // newest (default)
      filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    }

    return filtered
  }

  // Filtered & Sorted News
  const getFilteredAndSortedNews = () => {
    let filtered = newsList.filter((n) => {
      const q = newsSearch.toLowerCase()
      return !q || n.title?.toLowerCase().includes(q) || n.excerpt?.toLowerCase().includes(q)
    })

    // Apply sorting
    if (newsSort === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
    } else {
      // newest (default)
      filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    }

    return filtered
  }

  // Paginated aspirations
  const allFilteredAspirations = getFilteredAndSortedAspirations()
  const totalFilteredAspirations = allFilteredAspirations.length
  const paginatedAspirations = allFilteredAspirations.slice(
    (aspirationPage - 1) * aspirationPerPage,
    aspirationPage * aspirationPerPage
  )
  const maxAspirationsPages = Math.ceil(totalFilteredAspirations / aspirationPerPage) || 1

  // Paginated news
  const allFilteredNews = getFilteredAndSortedNews()
  const totalFilteredNews = allFilteredNews.length
  const paginatedNews = allFilteredNews.slice(
    (newsPage - 1) * newsPerPage,
    newsPage * newsPerPage
  )
  const maxNewsPages = Math.ceil(totalFilteredNews / newsPerPage) || 1

  // Reset to page 1 when filters/search changes
  useEffect(() => {
    setAspirationPage(1)
  }, [aspirationFilter, aspirationSearch, aspirationSort])

  useEffect(() => {
    setNewsPage(1)
  }, [newsSearch, newsSort])

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
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-primary text-black font-semibold text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <span>✨</span>
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
          <div className="space-y-8 animate-fade-in">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Aspirasi</span>
                  <span className="text-2xl">📬</span>
                </div>
                <div className="font-poppins font-black text-3xl text-white">{totalAspirations}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${aspirationCompletionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">{aspirationCompletionRate}% Selesai</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Aspirasi Pending</span>
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="font-poppins font-black text-3xl text-primary">{pendingAspirations}</div>
                <p className="text-[11px] text-gray-400 mt-1">Perlu respon tim Humas</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Artikel Publikasi</span>
                  <span className="text-2xl">📰</span>
                </div>
                <div className="font-poppins font-black text-3xl text-white">{totalNews}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(newsCategoryStats).map(([cat, count]) => (
                    count > 0 && (
                      <span key={cat} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">
                        {cat}: {count}
                      </span>
                    )
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Koneksi Backend</span>
                  <span className="text-2xl">🔌</span>
                </div>
                <div className="font-poppins font-black text-lg text-emerald-400 mt-1">
                  {backendOnline ? 'REST API Online' : 'Mode Demo / Offline'}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Status koneksi ke database</p>
              </div>
            </div>

            {/* Quick Overview Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Aspirations */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-poppins font-bold text-base text-white flex items-center gap-2">
                    <span>📬</span> Aspirasi Terbaru
                  </h2>
                  <button
                    onClick={() => setActiveTab('aspirations')}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Lihat Semua &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {[...aspirations]
                    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
                    .slice(0, 4)
                    .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedAspiration(item)
                        setActiveTab('aspirations')
                      }}
                      className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs text-white">{item.name}</span>
                          <span className="text-[10px] text-gray-500">NIM: {item.nim || '-'}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 line-clamp-1">{item.message}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap font-medium ${
                          item.status === 'Selesai'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.status || 'Pending'}
                      </span>
                    </div>
                  ))}
                  {aspirations.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-6">Belum ada aspirasi masuk.</p>
                  )}
                </div>
              </div>

              {/* Recent Articles */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-poppins font-bold text-base text-white flex items-center gap-2">
                    <span>📰</span> Berita & Publikasi Terbaru
                  </h2>
                  <button
                    onClick={() => setActiveTab('news')}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Kelola &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {[...newsList]
                    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
                    .slice(0, 3)
                    .map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-primary font-semibold">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-gray-500">{item.author}</span>
                        </div>
                        <h3 className="font-semibold text-xs text-white line-clamp-1">{item.title}</h3>
                      </div>
                      <button
                        onClick={() => openEditNewsModal(item)}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-primary hover:text-black text-[11px] font-semibold transition-colors shrink-0 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                  {newsList.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-6">Belum ada berita dibuat.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ASPIRASI MAHASISWA */}
        {activeTab === 'aspirations' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-poppins font-bold text-xl text-white">Kotak Suara Aspirasi Mahasiswa</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Kelola kritik, saran, serta pertanyaan yang dikirimkan melalui website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportAspirationsCSV}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📥</span> Ekspor CSV
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, NIM, atau kata kunci pesan..."
                  value={aspirationSearch}
                  onChange={(e) => setAspirationSearch(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['Semua', 'Saran', 'Kritik', 'Akademik', 'Fasilitas'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setAspirationFilter(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      aspirationFilter === cat
                        ? 'bg-primary text-black'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <select
                value={aspirationSort}
                onChange={(e) => setAspirationSort(e.target.value as 'newest' | 'oldest' | 'status')}
                className="px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="status">Status (Pending dulu)</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                Menampilkan{' '}
                <span className="text-white font-semibold">
                  {totalFilteredAspirations === 0 ? 0 : (aspirationPage - 1) * aspirationPerPage + 1}-
                  {Math.min(aspirationPage * aspirationPerPage, totalFilteredAspirations)}
                </span>{' '}
                dari <span className="text-white font-semibold">{totalFilteredAspirations}</span> aspirasi
              </span>
            </div>

            {/* Aspirations List / Table */}
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-gray-400 font-semibold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Pengirim</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Pesan Aspirasi</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Waktu</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedAspirations.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-[11px] text-gray-500">NIM: {item.nim || '-'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-primary border border-primary/20 text-[10px] font-semibold">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="line-clamp-2 text-gray-300">{item.message}</p>
                          <button
                            onClick={() => setSelectedAspiration(item)}
                            className="text-[11px] text-primary hover:underline mt-0.5 font-medium cursor-pointer"
                          >
                            Baca Lengkap
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleAspirationStatus(item)}
                            title="Klik untuk ubah status"
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer transition-all ${
                              item.status === 'Selesai'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                            }`}
                          >
                            {item.status === 'Selesai' ? '✓ Selesai' : '⏳ Pending'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap text-[11px]">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Baru saja'}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedAspiration(item)}
                              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] font-medium cursor-pointer"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => handleDeleteAspiration(item.id)}
                              className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-medium cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedAspirations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          Tidak ditemukan aspirasi yang cocok dengan pencarian / filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {maxAspirationsPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Tampilkan</span>
                  <select
                    value={aspirationPerPage}
                    onChange={(e) => {
                      setAspirationPerPage(Number(e.target.value))
                      setAspirationPage(1)
                    }}
                    className="px-2 py-1 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {[10, 25, 50, 100].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span>per halaman</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAspirationPage((p) => Math.max(1, p - 1))}
                    disabled={aspirationPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    ← Sebelumnya
                  </button>

                  {Array.from({ length: maxAspirationsPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === maxAspirationsPages || Math.abs(p - aspirationPage) <= 1)
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center gap-1.5">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="text-gray-600 text-xs px-1">…</span>
                        )}
                        <button
                          onClick={() => setAspirationPage(p)}
                          className={`min-w-[32px] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            aspirationPage === p
                              ? 'bg-primary text-black'
                              : 'bg-white/5 hover:bg-white/10 text-gray-300'
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}

                  <button
                    onClick={() => setAspirationPage((p) => Math.min(maxAspirationsPages, p + 1))}
                    disabled={aspirationPage === maxAspirationsPages}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    Berikutnya →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: KELOLA BERITA */}
        {activeTab === 'news' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-poppins font-bold text-xl text-white">Manajemen Berita & Kegiatan</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Publikasikan kegiatan himpunan, artikel keprofesian tambang, dan prestasi mahasiswa.
                </p>
              </div>

              <button
                onClick={openCreateNewsModal}
                className="px-4 py-2.5 rounded-xl bg-primary text-black font-poppins font-bold text-xs hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>➕</span> Tulis Berita Baru
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-md relative">
                <input
                  type="text"
                  placeholder="Cari judul artikel..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={newsSort}
                  onChange={(e) => setNewsSort(e.target.value as 'newest' | 'oldest')}
                  className="px-3 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                </select>

                <button
                  onClick={openCreateNewsModal}
                  className="px-4 py-2.5 rounded-xl bg-primary text-black font-poppins font-bold text-xs hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>➕</span> Berita Baru
                </button>
              </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedNews.map((article) => (
                <div
                  key={article.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-primary/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase">
                        {article.category}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID') : 'Baru'}
                      </span>
                    </div>
                    <h3 className="font-poppins font-bold text-sm text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
                      {article.excerpt || article.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-500">{article.author || 'Humas HMTP'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditNewsModal(article)}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-primary hover:text-black text-gray-200 font-semibold transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNews(article.id)}
                        className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-all cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {paginatedNews.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 text-xs">
                  Tidak ada artikel berita ditemukan. Klik &quot;Berita Baru&quot; untuk menambahkan.
                </div>
              )}
            </div>

            {/* News Pagination Controls */}
            {maxNewsPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setNewsPage((p) => Math.max(1, p - 1))}
                  disabled={newsPage === 1}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ←
                </button>
                {Array.from({ length: maxNewsPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewsPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      newsPage === p ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setNewsPage((p) => Math.min(maxNewsPages, p + 1))}
                  disabled={newsPage === maxNewsPages}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  →
                </button>
              </div>
            )}
          </div>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <span className="font-poppins font-bold text-base text-white">Detail Pesan Aspirasi</span>
              <button
                onClick={() => setSelectedAspiration(null)}
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
                <label className="text-gray-400 block text-[10px] uppercase mb-1.5 font-semibold">Isi Pesan:</label>
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
                  onClick={() => setSelectedAspiration(null)}
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 max-w-xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <span className="font-poppins font-bold text-base text-white">
                {editingNews ? 'Edit Artikel Berita' : 'Tulis Berita Baru'}
              </span>
              <button
                onClick={() => setIsNewsModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4 text-xs font-inter">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Judul Artikel</label>
                <input
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
                  <label className="block text-gray-300 font-semibold mb-1">Kategori</label>
                  <select
                    value={newsFormData.category}
                    onChange={(e) => setNewsFormData({ ...newsFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Sosial">Sosial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Penulis / Departemen</label>
                  <input
                    type="text"
                    required
                    value={newsFormData.author}
                    onChange={(e) => setNewsFormData({ ...newsFormData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Ringkasan / Excerpt</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan singkat yang muncul di kartu depan..."
                  value={newsFormData.excerpt}
                  onChange={(e) => setNewsFormData({ ...newsFormData, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Isi Artikel Lengkap</label>
                <textarea
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
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-black font-semibold text-xs hover:bg-yellow-400 transition-colors cursor-pointer"
                >
                  {editingNews ? 'Simpan Perubahan' : 'Terbitkan Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}