import { DailyReportTheme } from '@/services/daily-report/types'

export const keys = {
  GET_DAILY_REPORT: (id?: string) => ['getDailyReport', id].filter(Boolean),
  GET_DAILY_REPORTS_BY_THEME: (theme: DailyReportTheme) => ['getDailyReportsByTheme', theme],
} as const

export type DailyReportKeys = typeof keys

