export const dailyReportEndpoints = {
  DAILY_REPORT_CONTENT_META: (uuid: string) => `/api/report/daily-content-list/${uuid}`,
  DAILY_REPORT_CONTENT_LIST: '/api/report/daily-content-list',
  DAILY_REPORT_THEME_NEWS: '/api/report/theme-news',
  DAILY_REPORT_LLM_CONTENT: '/api/report/daily-llm-content',
  DAILY_REPORT_ITEM_INFO: '/api/report/daily-item-info',
  DAILY_REPORT_THEME_GRAPH: '/api/report/theme-graph',
} as const

export type DailyReportEndpointKey = keyof typeof dailyReportEndpoints

