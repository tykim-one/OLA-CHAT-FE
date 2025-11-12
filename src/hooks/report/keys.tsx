import { QueryKey } from '@tanstack/react-query'

import * as T from '@/services/report/types'

export const keys = {
  GENERATE_REPORT: () => ['generateReport'],
  GET_REPORT_DATA: (id?: string) => ['getReportData', id].filter(Boolean),
} as const

export type ReportKeys = typeof keys
