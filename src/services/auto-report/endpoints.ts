export const endpoints = {
  AUTO_REPORTS_LIST: '/ibk/auto-reports',
  AUTO_REPORTS_BY_TAB: (tabType: string) => `/ibk/auto-reports/${tabType}`,
  AUTO_REPORT_DETAIL: (reportId: string) => `/ibk/auto-reports/${reportId}/detail`,
  AUTO_REPORT_CONTENT_LIST: '/ibk/reports/daily-content-list',
  MAIN_THEME_LIST: '/ibk/reports/main-theme-list',
} as const

export type AutoReportEndpointKey = keyof typeof endpoints
