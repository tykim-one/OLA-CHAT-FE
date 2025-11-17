export const endpoints = {
  IBK_REPORT_GENERATE: '/api/manual-report/content-meta',
  IBK_REPORT_GET_DATA: '/api/manual-report/content-summary/content-meta',
} as const

export type EndpointKey = keyof typeof endpoints
