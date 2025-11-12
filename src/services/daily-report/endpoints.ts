export const dailyReportEndpoints = {
  DAILY_REPORT_CONTENT_META: (uuid: string) => `/ibk/reports/daily-content-list/${uuid}`,
  DAILY_REPORT_CONTENT_LIST: '/ibk/reports/daily-content-list',
  DAILY_REPORT_THEME_NEWS: '/ibk/reports/theme-news',
  DAILY_REPORT_LLM_CONTENT: '/ibk/reports/daily-llm-content',
  DAILY_REPORT_ITEM_INFO: '/ibk/reports/daily-item-info',
  DAILY_REPORT_THEME_GRAPH: '/ibk/reports/theme-graph',
} as const

export type DailyReportEndpointKey = keyof typeof dailyReportEndpoints

