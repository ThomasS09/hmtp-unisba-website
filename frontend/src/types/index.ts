export interface NewsArticle {
  id: number
  title: string
  category: 'Semua' | 'Kegiatan' | 'Prestasi' | 'Akademik' | 'Sosial' | string
  date?: string
  excerpt: string
  content?: string
  author: string
  read_time?: string
  readTime?: string
  gradient?: string
  created_at?: string
  updated_at?: string
}

export interface NewsInput {
  title: string
  category: string
  author: string
  excerpt: string
  content: string
}

export type AspirationCategory = 'Saran' | 'Kritik' | 'Akademik' | 'Kegiatan' | string

export type AspirationStatus = 'Pending' | 'Selesai' | 'Arsip'

export interface Aspiration {
  id: number
  name: string
  nim?: string | null
  category: AspirationCategory
  message: string
  status: AspirationStatus
  is_anonymous?: boolean
  created_at?: string
  updated_at?: string
}

export interface AspirationInput {
  name: string
  nim?: string
  category: string
  message: string
  is_anonymous?: boolean
}

export interface ProfileItem {
  id: number
  type: 'visi' | 'misi'
  body: string
  sort_order: number
}

export interface Cabinet {
  id: number
  name: string
  period: string
  name_meaning?: string | null
  logo_path?: string | null
  logo_url?: string | null
  is_active: boolean
  members_count?: number
}

export interface Department {
  id: number
  name: string
  slug: string
  sort_order: number
  programs_count?: number
}

export interface Member {
  id: number
  cabinet_id?: number
  department_id?: number | null
  kelompok: 'Pengurus Inti' | 'Ketua Bidang'
  position: string
  name: string
  npm?: string | null
  photo_path?: string | null
  photo_url?: string | null
  department?: string | null
  department_slug?: string | null
  sort_order?: number
}

export interface Program {
  id: number
  cabinet_id?: number
  department_id?: number
  name: string
  type: 'Program Kerja' | 'Aktivitas Kerja'
  description?: string | null
  schedule?: string | null
  status?: 'Rencana' | 'Berjalan' | 'Selesai'
  image_path?: string | null
  image_url?: string | null
  department?: string | null
  department_slug?: string | null
}

export interface Contact {
  id?: number
  website?: string | null
  email: string
  instagram?: string | null
  tiktok?: string | null
  youtube?: string | null
}

export interface SiteData {
  profile: {
    visi: string[]
    misi: string[]
  }
  cabinet: Cabinet | null
  cabinets: Cabinet[]
  departments: Department[]
  members: Member[]
  programs: Program[]
  contact: Contact | null
}

export interface User {
  id: number
  name: string
  email: string
  created_at?: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  message?: string
  access_token: string
  token_type: string
  user: User
}

export interface ApiResponse<T> {
  success?: boolean
  message?: string
  data?: T
}
