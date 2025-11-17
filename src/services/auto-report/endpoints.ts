export const endpoints = {
  AUTO_REPORTS_LIST: '/api/report',
  AUTO_REPORTS_BY_TAB: (tabType: string) => `/api/report/${tabType}`,
  AUTO_REPORT_DETAIL: (reportId: string) => `/api/report/${reportId}/detail`,
  AUTO_REPORT_CONTENT_LIST: '/api/report/daily-content-list',
  MAIN_THEME_LIST: '/api/report/main-theme-list',
} as const

export type AutoReportEndpointKey = keyof typeof endpoints
