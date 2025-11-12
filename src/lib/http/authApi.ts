import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const authApi = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds
})

// Request interceptor
authApi.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor
authApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export { authApi }
