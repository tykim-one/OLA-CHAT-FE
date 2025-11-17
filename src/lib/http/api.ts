import axios from 'axios'

const baseURL = 'http://192.168.1.10:8001'

// Unauthenticated API client
export const api = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds
})


api.interceptors.request.use(
  (config) => {
    // auth_token이 필수로 필요함
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
