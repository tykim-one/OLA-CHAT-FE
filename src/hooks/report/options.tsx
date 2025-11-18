import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

import * as api from '@/services/report/api'
import * as T from '@/services/report/types'

import { keys } from './keys'
import {
  GetReportDataRequest,
  ReportDataModel,
  ReportGenerationModel,
  ReportGenerationResult,
  transformGetReportDataRequestModel,
  transformReportDataResponseDTO,
  transformReportGenerationRequestModel,
  transformReportGenerationResponseDTO,
} from './transforms'

// 옵션 타입 정의 - 도메인 모델 타입 사용
export type GenerateReportMutationOptions = Partial<
  UseMutationOptions<ReportGenerationResult, any, ReportGenerationModel>
>
export type GetReportDataQueryOptions = Partial<UseQueryOptions<ReportDataModel>>

// 옵션 함수들
export const generateReportMutationOptions = (options?: GenerateReportMutationOptions) => {
  return {
    ...options,
    mutationKey: keys.GENERATE_REPORT(),
    mutationFn: async (reportRequest: ReportGenerationModel) => {
      // 쿼리 호출시 nextjs의 렌더링 관련 오류 방지 코드
      await Promise.resolve()

      return api
        .generateReport(transformReportGenerationRequestModel(reportRequest))
        .then((response) => transformReportGenerationResponseDTO(response))
    },
    retry: false,
  }
}

export const getReportDataQueryOptions = (id: string, options?: GetReportDataQueryOptions) => {
  return {
    ...options,
    queryKey: keys.GET_REPORT_DATA(id),
    queryFn: async () => {
      // 쿼리 호출시 nextjs의 렌더링 관련 오류 방지 코드
      await Promise.resolve()

      return api.getReportData(transformGetReportDataRequestModel({ id })).then((response) => {
        return transformReportDataResponseDTO(response)
      })
    },
    enabled: !!id, // id가 있을 때만 쿼리 실행
  }
}

