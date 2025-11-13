import { useEffect, useState } from 'react'

import type { MarketSummary, PerformanceRow, RecommendedProducts, ReportData } from '@/types/report'

import { categoryMap } from '@/constants/report'

import { useGetReportDataQuery } from './data-fetching/report/hooks'
import type { ReportDataItemModel, ReportDataModel } from './data-fetching/report/transforms'

export const useReportData = (id: string) => {
  const [marketSummary, setMarketSummary] = useState<MarketSummary>({})
  const [performanceRows, setPerformanceRows] = useState<PerformanceRow[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProducts>({})

  // React Query 훅을 직접 사용
  const { data: reportDataModel, isLoading, error, refetch } = useGetReportDataQuery(id)

  // ReportDataModel을 ReportData[]로 변환하는 함수
  const convertReportModelToReportData = (model: ReportDataModel): ReportData[] => {
    if (!model || !Array.isArray(model)) {
      return []
    }

    // model이 이미 배열이므로 직접 변환
    return model.map((item: ReportDataItemModel) => ({
      category: item.category,
      content: {
        title: item.content.title,
        content: item.content.content,
        performance_rows: item.content.performance_rows,
        recommended_products: item.content.recommended_products,
      },
      graph_image_path: item.graph_image_path,
      title: item.title,
      period: item.period as 'daily' | 'weekly' | 'monthly',
    }))
  }

  const convertToMarketSummary = (input: ReportData[]): MarketSummary => {
    const result: MarketSummary = {}

    if (!Array.isArray(input)) {
      return result
    }
    input.forEach((item: ReportData) => {
      if (item.category === 'portfolio_recommendation') {
        return
      }

      const korCategory = categoryMap[item.category]
      if (!korCategory) {
        return
      }

      result[korCategory] = {
        title: item.content?.title ?? '',
        content: item.content?.content ?? [],
        image: item.graph_image_path ?? undefined,
      }
    })

    return result
  }

  // reportDataModel이 변경될 때마다 파생된 상태들을 업데이트
  useEffect(() => {
    if (reportDataModel && Array.isArray(reportDataModel)) {
      const reportData = convertReportModelToReportData(reportDataModel)

      if (reportData.length > 0) {
        const marketSummary = convertToMarketSummary(reportData)
        setMarketSummary(marketSummary)

        const portfolioRecommendation = reportData.find(
          (item: ReportData) => item.category === 'portfolio_recommendation',
        )

        const performanceRows = portfolioRecommendation?.content?.performance_rows || []
        const recommendedProducts = portfolioRecommendation?.content?.recommended_products || {}

        setPerformanceRows(performanceRows)
        setRecommendedProducts(recommendedProducts)
      }
    }
  }, [reportDataModel])

  return {
    report: reportDataModel ? convertReportModelToReportData(reportDataModel) : [],
    marketSummary,
    performanceRows,
    recommendedProducts,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  }
}
