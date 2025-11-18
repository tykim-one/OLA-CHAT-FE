import { api } from '@/lib/http'

import { endpoints } from './endpoints'
import * as T from './types'

export const generateReport = async (args: T.ReportGenerationRequest) => {
  return api
    .post<T.ReportGenerationResponse>(endpoints.IBK_REPORT_GENERATE, args)
    .then((d) => d.data)
}

export const getReportData = async (args: T.GetReportDataRequest) => {
  return api
    .get<T.GetReportDataResponse>(`${endpoints.IBK_REPORT_GET_DATA}/${args.id}`)
    .then((d) => d.data)
}

export const getContentMeta = async () => {
  return api
    .get<T.GetContentMetaResponse>(endpoints.IBK_REPORT_GENERATE)
    .then((d) => d.data)
}
