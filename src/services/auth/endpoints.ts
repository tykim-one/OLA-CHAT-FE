export const endpoints = {
  IBK_AUTH_LOGIN: '/ibk/auth/login',
  IBK_AUTH_ME: '/ibk/auth/me',
  // 회원가입 관련 엔드포인트
  SEND_VERIFICATION_CODE: '/api/auth/send-verification-code',
  VERIFY_EMAIL: '/api/auth/verify-email',
  SIGN_IN: '/api/auth/sign-in',
  SIGN_UP: '/api/auth/sign-up',
} as const

export type EndpointKey = keyof typeof endpoints
