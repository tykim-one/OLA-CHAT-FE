import { useIsMutating, useMutation, useQuery } from '@tanstack/react-query'

import { keys } from './keys'
import {
  GenerateReportMutationOptions,
  GetReportDataQueryOptions,
  generateReportMutationOptions,
  getReportDataQueryOptions,
} from './options'

// 쿼리 훅들
export const useGetReportDataQuery = (id: string, options?: GetReportDataQueryOptions) => {
  return useQuery(getReportDataQueryOptions(id, options))
}

// 뮤테이션 훅들
export const useGenerateReportMutation = (options?: GenerateReportMutationOptions) => {
  return useMutation(generateReportMutationOptions(options))
}

// isMutating 훅들
export const useIsMutatingGenerateReport = () => {
  const count = useIsMutating({ mutationKey: keys.GENERATE_REPORT() })
  return { count, isMutating: !!count }
}
