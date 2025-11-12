import { DailySummaryData } from '@/types/dailySummary'

export type GetDailySummaryRequestModel = {
  id: string
}

export type DailySummaryModel = DailySummaryData

export const transformGetDailySummaryRequestModel = (
  request: GetDailySummaryRequestModel,
): { id: string } => {
  return {
    id: request.id,
  }
}

export const transformDailySummaryResponseDTO = (response: DailySummaryData): DailySummaryModel => {
  return {
    id: response.id,
    title: response.title,
    aiReportInfo: response.aiReportInfo,
    marketKeywords: response.marketKeywords,
    topNews: response.topNews,
    marketTrends: response.marketTrends.map((trend) => ({
      ...trend,
      // date,
    })),
    globalIndices: response.globalIndices,
    exchangeRates: response.exchangeRates,
    commodityPrices: response.commodityPrices,
    aiInsights: response.aiInsights,
  }
}
