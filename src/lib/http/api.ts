import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// Unauthenticated API client
export const api = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds
})

api.interceptors.request.use(
  (config) => {
    // No authentication for this client
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
