'use client'

import React from 'react'

import ReportPdfDownload from '@/components/report-generation/PdfDownload'
import { CompletedReportContainer } from '@/components/report/CompletedReportContainer'
import { PortfolioRecommendationContainer } from '@/components/report/PortfolioRecommendationContainer'
import { ReportCoverImage } from '@/components/report/ReportCoverImage'
import BreadCrumb from '@/components/shared/BreadCrumb'
import Header from '@/components/shared/Header'

import { useReportData } from '@/hooks/useReportData'

export default function MainReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)

  const { report, marketSummary, performanceRows, recommendedProducts, loading, error } =
    useReportData(id)

  if (loading) {
    return (
      <div className="h-screen bg-Grayscale-B50 font-pretendard flex items-center justify-center">
        <div className="text-lg">리포트를 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-Grayscale-B50 font-pretendard flex items-center justify-center">
        <div className="text-lg text-red-500">오류: {error}</div>
      </div>
    )
  }

  if (!report || report.length === 0) {
    return (
      <div className="h-screen bg-Grayscale-B50 font-pretendard flex items-center justify-center">
        <div className="text-lg">리포트를 찾을 수 없습니다.</div>
      </div>
    )
  }

  const reportMeta = {
    title: report[0]?.title || '리포트',
    period: report[0]?.period || 'daily',
  }

  return (
    <div className="h-screen bg-Grayscale-B50 font-pretendard overflow-y-scroll">
      <Header
        pdfButton={
          <ReportPdfDownload
            key={reportMeta.title}
            data={marketSummary}
            portfolioData={{ recommendedProducts, performanceRows }}
            reportMeta={reportMeta}
          />
        }
      />
      <div className="w-full h-full px-10 py-5">
        <BreadCrumb showHome={true} className="mb-5" customTitle={reportMeta.title} />

        <ReportCoverImage reportMeta={reportMeta} />

        {Object.entries(marketSummary).map(([key, value], index) => (
          <CompletedReportContainer
            key={key}
            headerTitle={key}
            title={(value as any)?.title || ''}
            content={(value as any)?.content || []}
            image={(value as any)?.image}
            pageNumber={index + 1}
          />
        ))}

        {Object.keys(recommendedProducts).length > 0 && performanceRows.length > 0 && (
          <PortfolioRecommendationContainer
            recommended_products={recommendedProducts}
            performance_rows={performanceRows}
            pageNumber={Object.keys(marketSummary).length + 1}
          />
        )}
      </div>
    </div>
  )
}
