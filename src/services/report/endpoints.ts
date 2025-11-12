export const endpoints = {
  IBK_REPORT_GENERATE: '/ibk/content-meta',
  IBK_REPORT_GET_DATA: '/ibk/content-summary/content-meta',
} as const

export type EndpointKey = keyof typeof endpoints
