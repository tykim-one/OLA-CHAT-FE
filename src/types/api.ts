/**
 * API 응답 공통 타입
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  error?: string
  data?: T
}

/**
 * 세션 생성 응답 타입
 */
export interface CreateSessionResponse {
  success: boolean
  session_id: string
  message: string
}

/**
 * 메시지 전송 응답 타입
 */
export interface SendMessageResponse {
  success: boolean
  session_id: string
  user_message: string
  ai_response: string
  model_used: string
  timestamp: string
  error?: string
  suggestion?: string
}

/**
 * 히스토리 조회 응답 타입
 */
export interface GetHistoryResponse {
  success: boolean
  session_id: string
  messages: import('./chat').ChatMessage[]
  total_messages: number
  created_at: string
  last_accessed: string
  error?: string
}
