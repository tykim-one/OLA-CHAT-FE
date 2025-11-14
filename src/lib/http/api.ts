import axios from 'axios'

const baseURL = 'https://ibk.api.onelineai.com'

// Unauthenticated API client
export const api = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds
})

const token = localStorage.getItem('auth_token')
api.interceptors.request.use(
  (config) => {
    config.headers.set('Authorization', `Bearer ${token}`)
    // No authentication for this client
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
