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
  timeout: 10000,
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
  if ((err as { message?: string })?.message) return 'Tidak bisa menghubungi server. Periksa koneksi Anda.'
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
    console.warn('Backend logout error (token revoked locally):', err)
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

// Protected News CRUD
export const createNews = async (data: Partial<NewsArticle>): Promise<ApiResponse<NewsArticle>> => {
  const response = await apiClient.post<ApiResponse<NewsArticle>>('/news', data)
  return response.data
}

export const updateNews = async (
  id: number | string,
  data: Partial<NewsArticle>
): Promise<ApiResponse<NewsArticle>> => {
  const response = await apiClient.put<ApiResponse<NewsArticle>>(`/news/${id}`, data)
  return response.data
}

export const deleteNews = async (id: number | string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/news/${id}`)
  return response.data
}

// Health Check
export const checkHealth = async (): Promise<{ ok: boolean; data?: unknown; error?: string }> => {
  try {
    const res = await apiClient.get('/news', { params: { limit: 1 } })
    return { ok: true, data: res.data }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return { ok: false, error: errorMessage }
  }
}

// Data situs publik (profil, kabinet aktif, pengurus, proker, kontak)
export const getSiteData = async (): Promise<SiteData> => {
  const response = await apiClient.get<ApiResponse<SiteData>>('/site')
  return response.data.data as SiteData
}

// Admin: Profil (Visi & Misi)
export const getProfileItems = async (): Promise<ProfileItem[]> => {
  const response = await apiClient.get<ApiResponse<ProfileItem[]>>('/profile-items')
  return response.data.data ?? []
}

export const createProfileItem = async (
  data: Partial<ProfileItem>
): Promise<ApiResponse<ProfileItem>> => {
  const response = await apiClient.post<ApiResponse<ProfileItem>>('/profile-items', data)
  return response.data
}

export const updateProfileItem = async (
  id: number,
  data: Partial<ProfileItem>
): Promise<ApiResponse<ProfileItem>> => {
  const response = await apiClient.put<ApiResponse<ProfileItem>>(`/profile-items/${id}`, data)
  return response.data
}

export const deleteProfileItem = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/profile-items/${id}`)
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
  return response.data
}

export const activateCabinet = async (id: number): Promise<ApiResponse<Cabinet>> => {
  const response = await apiClient.post<ApiResponse<Cabinet>>(`/cabinets/${id}/activate`)
  return response.data
}

export const deleteCabinet = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/cabinets/${id}`)
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
  return response.data
}

export const updateDepartment = async (
  id: number,
  data: Partial<Department>
): Promise<ApiResponse<Department>> => {
  const response = await apiClient.put<ApiResponse<Department>>(`/departments/${id}`, data)
  return response.data
}

export const deleteDepartment = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/departments/${id}`)
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
  return response.data
}

export const deleteMember = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/members/${id}`)
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
  return response.data
}

export const deleteProgram = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/programs/${id}`)
  return response.data
}

// Admin: Kontak
export const getContact = async (): Promise<Contact | null> => {
  const response = await apiClient.get<ApiResponse<Contact>>('/contact')
  return response.data.data ?? null
}

export const updateContact = async (data: Partial<Contact>): Promise<ApiResponse<Contact>> => {
  const response = await apiClient.put<ApiResponse<Contact>>('/contact', data)
  return response.data
}
