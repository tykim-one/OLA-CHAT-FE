export const endpoints = {
  STOCKS_SEARCH: '/api/search',
} as const

export type EndpointKey = keyof typeof endpoints
