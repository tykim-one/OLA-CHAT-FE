/**
 * 공통 API 타입 정의
 */

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface CreateSessionResponse {
  success: boolean
  session_id: string
  message?: string
}

export interface GetHistoryResponse {
  success: boolean
  messages: any[]
  message?: string
}

export interface SendMessageResponse {
  success: boolean
  message_id: string
  content: string
  message?: string
  ai_response: string
  error?: string
}

export interface SendAuthResponse {
  success: boolean
  message?: string
}