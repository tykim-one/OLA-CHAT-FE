/**
 * 채팅 관련 상수 정의
 */

// 채팅 상태
export const CHAT_STATES = {
  IDLE: 'idle',
  USER_TYPING: 'user_typing',
  MESSAGE_SENDING: 'message_sending',
  AI_LOADING: 'ai_loading',
  RESPONSE_RENDERED: 'response_rendered',
} as const

// 메시지 타입
export const MESSAGE_TYPES = {
  QUERY: 'query',
  ANSWER: 'answer',
  LOADING: 'loading',
} as const

// 입력 필드 상태
export const INPUT_STATES = {
  DEFAULT: 'default',
  FOCUSED: 'focused',
  LOADING: 'loading',
} as const

// 탭 카테고리
export const TAB_CATEGORIES = {
  RECOMMENDED: 'recommended',
  POPULAR: 'popular',
  STOCKS: 'stocks',
} as const

// API 설정
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  CHAT_SESSION_ID: 'chat_session_id',
  CHAT_HISTORY: 'chat_history',
  USER_PREFERENCES: 'user_preferences',
} as const

// 에러 메시지
export const ERROR_MESSAGES = {
  SESSION_CREATE_FAILED: '세션을 생성할 수 없습니다.',
  MESSAGE_SEND_FAILED: '메시지를 전송할 수 없습니다.',
  HISTORY_LOAD_FAILED: '채팅 히스토리를 불러올 수 없습니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const
