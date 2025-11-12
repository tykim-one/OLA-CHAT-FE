import { UseQueryOptions } from '@tanstack/react-query'

import { getDailySummary } from '@/services/daily-summary/api'

import { keys } from './keys'
import {
  DailySummaryModel,
  GetDailySummaryRequestModel,
  transformDailySummaryResponseDTO,
  transformGetDailySummaryRequestModel,
} from './transforms'

export type GetDailySummaryQueryOptions = Partial<UseQueryOptions<DailySummaryModel>>

export type { GetDailySummaryRequestModel }

export const getDailySummaryQueryOptions = (
  request: GetDailySummaryRequestModel,
  options?: GetDailySummaryQueryOptions,
) => {
  return {
    ...options,
    queryKey: keys.GET_DAILY_SUMMARY(request.id),
    queryFn: async () => {
      await Promise.resolve()

      if (!request.id) {
        throw new Error('일간 요약 데이터를 가져오려면 report id가 필요합니다.')
      }
      const transformedRequest = transformGetDailySummaryRequestModel(request)

      return getDailySummary(transformedRequest).then((response) => {
        return transformDailySummaryResponseDTO(response)
      })
    },
    enabled: options?.enabled ?? !!request.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }
}

