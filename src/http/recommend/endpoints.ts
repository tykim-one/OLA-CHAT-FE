export const endpoints = {
  RECOMMEND_QUESTIONS: '/recommend-questions',
  POPULAR_QUESTIONS: '/popular-questions',
  POPULAR_STOCKS: '/popular-stocks',
} as const

export type EndpointKey = keyof typeof endpoints
