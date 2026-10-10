import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

// Request Interceptor: Attach Bearer Token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response Interceptor: Handle Token Expired / Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('admin_user')
    }
    return Promise.reject(error)
  }
)

// Public Endpoints
export const getNews = async (params = {}) => {
  const response = await apiClient.get('/news', { params })
  return response.data
}

export const getNewsById = async (id) => {
  const response = await apiClient.get(`/news/${id}`)
  return response.data
}

export const submitAspiration = async (formData) => {
  const response = await apiClient.post('/aspirations', formData)
  return response.data
}

// Auth Endpoints
export const loginAdmin = async (credentials) => {
  const response = await apiClient.post('/login', credentials)
  if (response.data && response.data.access_token) {
    localStorage.setItem('token', response.data.access_token)
    if (response.data.user) {
      localStorage.setItem('admin_user', JSON.stringify(response.data.user))
    }
  }
  return response.data
}

export const logoutAdmin = async () => {
  try {
    await apiClient.post('/logout')
  } catch (err) {
    console.warn('Backend logout error (token revoked locally):', err)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('admin_user')
  }
}

export const getAdminProfile = async () => {
  const response = await apiClient.get('/me')
  return response.data
}

// Protected Aspirations Management
export const getAspirations = async () => {
  const response = await apiClient.get('/aspirations')
  return response.data
}

export const updateAspirationStatus = async (id, status) => {
  const response = await apiClient.patch(`/aspirations/${id}/status`, { status })
  return response.data
}

export const deleteAspiration = async (id) => {
  const response = await apiClient.delete(`/aspirations/${id}`)
  return response.data
}

// Protected News CRUD
export const createNews = async (data) => {
  const response = await apiClient.post('/news', data)
  return response.data
}

export const updateNews = async (id, data) => {
  const response = await apiClient.put(`/news/${id}`, data)
  return response.data
}

export const deleteNews = async (id) => {
  const response = await apiClient.delete(`/news/${id}`)
  return response.data
}

// Health Check
export const checkHealth = async () => {
  try {
    const res = await apiClient.get('/news', { params: { limit: 1 } })
    return { ok: true, data: res.data }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

export default apiClient
