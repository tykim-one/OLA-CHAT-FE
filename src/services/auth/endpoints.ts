export const endpoints = {
  IBK_AUTH_LOGIN: '/ibk/auth/login',
  IBK_AUTH_ME: '/ibk/auth/me',
} as const

export type EndpointKey = keyof typeof endpoints
