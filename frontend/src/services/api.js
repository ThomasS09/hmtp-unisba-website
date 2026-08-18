import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

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
  return config;
}, (error) => {
  return Promise.reject(error)
})

// Response Interceptor: Handle Token Expired / Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

// Public Endpoints
export const getNews = async (params = {}) => {
  const response = await apiClient.get('/news', { params })
  return response.data
}

export const submitAspiration = async (formData) => {
  const response = await apiClient.post('/aspirations', formData)
  return response.data
}

// Auth & Protected Admin Endpoints
export const loginAdmin = async (credentials) => {
  const response = await apiClient.post('/login', credentials)
  if (response.data && response.data.access_token) {
    localStorage.setItem('token', response.data.access_token)
  }
  return response.data
}

export const logoutAdmin = async () => {
  try {
    await apiClient.post('/logout')
  } finally {
    localStorage.removeItem('token')
  }
}

export const getAdminProfile = async () => {
  const response = await apiClient.get('/me')
  return response.data
}

export const getAspirations = async () => {
  const response = await apiClient.get('/aspirations')
  return response.data
}

export default apiClient
