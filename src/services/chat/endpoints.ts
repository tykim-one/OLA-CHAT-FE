/**
 * 채팅 API 엔드포인트 정의
 */

export const CHAT_ENDPOINTS = {
  // 세션 관리
  CREATE_SESSION: '/api/ibk_securities/session/create',
  DELETE_SESSION: '/api/ibk_securities/session',

  // 메시지 관리
  SEND_MESSAGE: '/api/ibk_securities/message/send',
  SEND_MESSAGE_STREAM: '/api/ibk_securities/message/stream',
  GET_HISTORY: '/api/ibk_securities/message/history',

  // 기타
  HEALTH_CHECK: '/chat/health',
} as const

export type ChatEndpoint = (typeof CHAT_ENDPOINTS)[keyof typeof CHAT_ENDPOINTS]
