import { useQuery } from '@tanstack/react-query'

import {
  GetDailySummaryQueryOptions,
  GetDailySummaryRequestModel,
  getDailySummaryQueryOptions,
} from './options'

export const useGetDailySummaryQuery = (
  request: GetDailySummaryRequestModel,
  options?: GetDailySummaryQueryOptions,
) => {
  return useQuery(getDailySummaryQueryOptions(request, options))
}

