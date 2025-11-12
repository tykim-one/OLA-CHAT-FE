import { UseQueryOptions } from '@tanstack/react-query'

import {
  GetDailyReportRequestModel,
  GetDailyReportsByThemeRequestModel,
  DailyReportModel,
  DailyReportListModel,
  transformDailyReportResponseDTO,
  transformDailyReportsByThemeResponseDTO,
  transformGetDailyReportRequestModel,
  transformGetDailyReportsByThemeRequestModel,
} from './transforms'
import { getDailyReport, getDailyReportsByTheme } from '@/services/daily-report/api'
import { keys } from './keys'

export type GetDailyReportQueryOptions = Partial<UseQueryOptions<DailyReportModel>>

export type GetDailyReportsByThemeQueryOptions = Partial<UseQueryOptions<DailyReportListModel>>

export const getDailyReportQueryOptions = (
  request: GetDailyReportRequestModel,
  options?: GetDailyReportQueryOptions,
) => {
  return {
    ...options,
    queryKey: keys.GET_DAILY_REPORT(request.id),
    queryFn: async () => {
      await Promise.resolve()

      if (!request.id) {
        throw new Error('데일리 리포트를 가져오려면 report id가 필요합니다.')
      }

      return getDailyReport(transformGetDailyReportRequestModel(request)).then((response) => {
        return transformDailyReportResponseDTO(response)
      })
    },
    enabled: options?.enabled ?? !!request.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }
}

export const getDailyReportsByThemeQueryOptions = (
  request: GetDailyReportsByThemeRequestModel,
  options?: GetDailyReportsByThemeQueryOptions,
) => {
  return {
    ...options,
    queryKey: keys.GET_DAILY_REPORTS_BY_THEME(request.theme),
    queryFn: async () => {
      await Promise.resolve()

      if (!request.theme) {
        throw new Error('데일리 리포트를 가져오려면 theme 정보가 필요합니다.')
      }

      return getDailyReportsByTheme(transformGetDailyReportsByThemeRequestModel(request)).then(
        (response) => {
          return transformDailyReportsByThemeResponseDTO(response)
        },
      )
    },
    enabled: options?.enabled ?? !!request.theme,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }
}

