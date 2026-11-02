import axios from 'axios'
import type {
  NewsArticle,
  Aspiration,
  AspirationInput,
  LoginCredentials,
  AuthResponse,
  User,
  ApiResponse,
  SiteData,
  ProfileItem,
  ProfileItemInput,
  SiteSettings,
  Cabinet,
  Department,
  Member,
  Program,
  Contact,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Server lokal (php artisan serve) memproses satu request sekaligus dan
  // bisa butuh >1 s tiap request; timeout pendek membuat UI salah mengira
  // backend mati lalu menampilkan mode demo.
  timeout: 30000,
})

// Request Interceptor: Attach Bearer Token if present
apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: hapus sesi HANYA saat 401 (bukan setiap error)
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    const status = error?.response?.status
    const url: string = error?.config?.url || ''
    if (status === 401 && !url.includes('/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('admin_user')
      // Token kedaluwarsa: tanpa ini pengurus melihat dashboard kosong tanpa penjelasan.
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.assign('/admin/login')
      }
    }
    return Promise.reject(error)
  }
)

// Public Endpoints
export interface PaginatedResponse<T> {
  success: boolean
  data: T
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from: number | null
    to: number | null
  }
}

// Ambil array baris dari respons API yang bisa berbentuk:
// data:[...] | data:{data:[...]} | data:{data:{data:[...]}} (paginator)
const unwrapList = <T,>(payload: unknown): T[] => {
  const d = (payload as { data?: any })?.data
  if (Array.isArray(d)) return d as T[]
  if (Array.isArray(d?.data)) return d.data as T[]
  if (Array.isArray(d?.data?.data)) return d.data.data as T[]
  return []
}

export const getNews = async (params: Record<string, unknown> = {}): Promise<NewsArticle[]> => {
  const response = await apiClient.get<PaginatedResponse<NewsArticle[]>>('/news', { params })
  return unwrapList<NewsArticle>(response.data)
}

// Ubah error API jadi kalimat yang bisa dibaca pengurus.
// Laravel mengirim {message, errors: {field: [pesan, ...]}} untuk 422.
export const pesanError = (err: unknown, bawaan = 'Terjadi kesalahan. Coba lagi.'): string => {
  const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
    ?.response?.data
  const pesanPertama = data?.errors ? Object.values(data.errors)[0]?.[0] : undefined
  if (pesanPertama) return pesanPertama
  if (data?.message) return data.message
  // Gangguan jaringan/timeout (tanpa respons server) dilaporkan sebagai masalah
  // koneksi; 4xx/5xx memakai pesan backend di atas, sisanya pesan bawaan.
  const kode = (err as { code?: string })?.code
  const tanpaRespons = typeof err === 'object' && err !== null && !('response' in err)
  if (kode === 'ERR_NETWORK' || kode === 'ECONNABORTED' || tanpaRespons) {
    return 'Tidak bisa menghubungi server. Periksa koneksi Anda.'
  }
  return bawaan
}

export const submitAspiration = async (formData: AspirationInput): Promise<ApiResponse<Aspiration>> => {
  const response = await apiClient.post<ApiResponse<Aspiration>>('/aspirations', formData)
  return response.data
}

// Auth Endpoints
export const loginAdmin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/login', credentials)
  if (response.data && response.data.access_token) {
    localStorage.setItem('token', response.data.access_token)
    if (response.data.user) {
      localStorage.setItem('admin_user', JSON.stringify(response.data.user))
    }
  }
  return response.data
}

export const logoutAdmin = async (): Promise<void> => {
  try {
    await apiClient.post('/logout')
  } catch (err) {
    localStorage.removeItem('token')
    localStorage.removeItem('admin_user')
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('admin_user')
  }
}

export const getAdminProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>('/me')
  return response.data
}

export const changeAdminPassword = async (data: {
  current_password: string
  password: string
  password_confirmation: string
}): Promise<ApiResponse<void>> => {
  const response = await apiClient.post<ApiResponse<void>>('/password', data)
  return response.data
}

// Protected Aspirations Management
export const getAspirations = async (params: Record<string, unknown> = {}): Promise<Aspiration[]> => {
  const response = await apiClient.get<PaginatedResponse<Aspiration[]>>('/aspirations', { params })
  return unwrapList<Aspiration>(response.data)
}

export const updateAspirationStatus = async (
  id: number | string,
  status: string
): Promise<ApiResponse<Aspiration>> => {
  const response = await apiClient.patch<ApiResponse<Aspiration>>(`/aspirations/${id}/status`, { status })
  return response.data
}

export const deleteAspiration = async (id: number | string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/aspirations/${id}`)
  return response.data
}

// Invalidate site data cache after admin CRUD
const invalidateSiteDataCache = () => {
  window.dispatchEvent(new Event('siteDataInvalidate'))
}

// Protected News CRUD
export const createNews = async (data: Partial<NewsArticle>): Promise<ApiResponse<NewsArticle>> => {
  const response = await apiClient.post<ApiResponse<NewsArticle>>('/news', data)
  invalidateSiteDataCache()
  return response.data
}

export const updateNews = async (
  id: number | string,
  data: Partial<NewsArticle>
): Promise<ApiResponse<NewsArticle>> => {
  const response = await apiClient.put<ApiResponse<NewsArticle>>(`/news/${id}`, data)
  invalidateSiteDataCache()
  return response.data
}

export const deleteNews = async (id: number | string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/news/${id}`)
  invalidateSiteDataCache()
  return response.data
}

// Health Check
// Data situs publik (profil, kabinet aktif, pengurus, proker, kontak)
export const getSiteData = async (): Promise<SiteData> => {
  const response = await apiClient.get<ApiResponse<SiteData>>('/site')
  return response.data.data as SiteData
}

// Admin: Pengaturan Beranda (teks hero)
export const getSiteSettings = async (): Promise<SiteSettings> => {
  const response = await apiClient.get<ApiResponse<SiteSettings>>('/site-settings')
  return response.data.data ?? {}
}

export const updateSiteSettings = async (settings: SiteSettings): Promise<SiteSettings> => {
  const response = await apiClient.put<ApiResponse<SiteSettings>>('/site-settings', { settings })
  invalidateSiteDataCache()
  return response.data.data ?? {}
}

// Admin: Profil (visi/misi & narasi halaman)
export const getProfileItems = async (): Promise<ProfileItem[]> => {
  const response = await apiClient.get<ApiResponse<ProfileItem[]>>('/profile-items')
  return response.data.data ?? []
}

export const createProfileItem = async (
  data: ProfileItemInput
): Promise<ApiResponse<ProfileItem>> => {
  const response = await apiClient.post<ApiResponse<ProfileItem>>('/profile-items', data)
  invalidateSiteDataCache()
  return response.data
}

export const updateProfileItem = async (
  id: number,
  data: ProfileItemInput
): Promise<ApiResponse<ProfileItem>> => {
  const response = await apiClient.put<ApiResponse<ProfileItem>>(`/profile-items/${id}`, data)
  invalidateSiteDataCache()
  return response.data
}

export const deleteProfileItem = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/profile-items/${id}`)
  invalidateSiteDataCache()
  return response.data
}

// Admin: Kabinet
export const getCabinets = async (): Promise<Cabinet[]> => {
  const response = await apiClient.get<ApiResponse<Cabinet[]>>('/cabinets')
  return response.data.data ?? []
}

// Payload kabinet memakai FormData agar logo bisa diunggah.
const cabinetForm = (data: Partial<Cabinet>, logo?: File | null): FormData => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Laravel rule "boolean" hanya menerima 1/0, bukan "true"/"false".
      form.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value))
    }
  })
  if (logo) form.append('logo', logo)
  return form
}

export const createCabinet = async (
  data: Partial<Cabinet>,
  logo?: File | null
): Promise<ApiResponse<Cabinet>> => {
  const response = await apiClient.post<ApiResponse<Cabinet>>('/cabinets', cabinetForm(data, logo))
  invalidateSiteDataCache()
  return response.data
}

export const updateCabinet = async (
  id: number,
  data: Partial<Cabinet>,
  logo?: File | null
): Promise<ApiResponse<Cabinet>> => {
  // POST + _method karena PHP tidak membaca file dari body PUT multipart.
  const form = cabinetForm(data, logo)
  form.append('_method', 'PUT')
  const response = await apiClient.post<ApiResponse<Cabinet>>(`/cabinets/${id}`, form)
  invalidateSiteDataCache()
  return response.data
}

export const activateCabinet = async (id: number): Promise<ApiResponse<Cabinet>> => {
  const response = await apiClient.post<ApiResponse<Cabinet>>(`/cabinets/${id}/activate`)
  invalidateSiteDataCache()
  return response.data
}

export const deleteCabinet = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/cabinets/${id}`)
  invalidateSiteDataCache()
  return response.data
}

// Admin: Bidang
export const getDepartments = async (): Promise<Department[]> => {
  const response = await apiClient.get<ApiResponse<Department[]>>('/departments')
  return response.data.data ?? []
}

export const createDepartment = async (
  data: Partial<Department>
): Promise<ApiResponse<Department>> => {
  const response = await apiClient.post<ApiResponse<Department>>('/departments', data)
  invalidateSiteDataCache()
  return response.data
}

export const updateDepartment = async (
  id: number,
  data: Partial<Department>
): Promise<ApiResponse<Department>> => {
  const response = await apiClient.put<ApiResponse<Department>>(`/departments/${id}`, data)
  invalidateSiteDataCache()
  return response.data
}

export const deleteDepartment = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/departments/${id}`)
  invalidateSiteDataCache()
  return response.data
}

// Admin: Pengurus
export const getMembers = async (params: Record<string, unknown> = {}): Promise<Member[]> => {
  const response = await apiClient.get<ApiResponse<Member[]>>('/members', { params })
  return response.data.data ?? []
}

const memberForm = (data: Partial<Member>, photo?: File | null): FormData => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (photo) form.append('photo', photo)
  return form
}

export const createMember = async (
  data: Partial<Member>,
  photo?: File | null
): Promise<ApiResponse<Member>> => {
  const response = await apiClient.post<ApiResponse<Member>>('/members', memberForm(data, photo))
  invalidateSiteDataCache()
  return response.data
}

export const updateMember = async (
  id: number,
  data: Partial<Member>,
  photo?: File | null
): Promise<ApiResponse<Member>> => {
  const response = await apiClient.post<ApiResponse<Member>>(
    `/members/${id}`,
    memberForm(data, photo)
  )
  invalidateSiteDataCache()
  return response.data
}

export const deleteMember = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/members/${id}`)
  invalidateSiteDataCache()
  return response.data
}

// Admin: Proker & Aker
export const getPrograms = async (params: Record<string, unknown> = {}): Promise<Program[]> => {
  const response = await apiClient.get<ApiResponse<Program[]>>('/programs', { params })
  return response.data.data ?? []
}

const programForm = (data: Partial<Program>, image?: File | null): FormData => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (image) form.append('image', image)
  return form
}

export const createProgram = async (
  data: Partial<Program>,
  image?: File | null
): Promise<ApiResponse<Program>> => {
  const response = await apiClient.post<ApiResponse<Program>>('/programs', programForm(data, image))
  invalidateSiteDataCache()
  return response.data
}

export const updateProgram = async (
  id: number,
  data: Partial<Program>,
  image?: File | null
): Promise<ApiResponse<Program>> => {
  const response = await apiClient.post<ApiResponse<Program>>(
    `/programs/${id}`,
    programForm(data, image)
  )
  invalidateSiteDataCache()
  return response.data
}

export const deleteProgram = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/programs/${id}`)
  invalidateSiteDataCache()
  return response.data
}

// Admin: Kontak
export const getContact = async (): Promise<Contact | null> => {
  const response = await apiClient.get<ApiResponse<Contact>>('/contact')
  return response.data.data ?? null
}

export const updateContact = async (data: Partial<Contact>): Promise<ApiResponse<Contact>> => {
  const response = await apiClient.put<ApiResponse<Contact>>('/contact', data)
  invalidateSiteDataCache()
  return response.data
}
