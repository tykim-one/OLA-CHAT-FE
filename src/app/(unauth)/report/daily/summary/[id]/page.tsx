'use client'

import { useParams } from 'next/navigation'
import React from 'react'

import { FileDown } from 'lucide-react'

import {
  AiInsightsSection,
  CommodityPricesSection,
  ExchangeRatesSection,
  GlobalIndicesSection,
  KeywordsSection,
  MarketTrendsSection,
  NewsSection,
  NoticeSection,
  ReportHeader,
} from '@/components/daily-summary'
import { PdfDailySummaryDocument } from '@/components/report-generation/PdfDailySummaryDocument'
import { ReportPageLayout, ReportStatusMessage } from '@/components/report/shared'
import Header from '@/components/shared/Header'

import { useGetDailySummaryQuery } from '@/hooks/data-fetching/daily'

const DailySummaryPage: React.FC = () => {
  const params = useParams()
  const id = params?.id as string | undefined

  const { data, isLoading, isError, error, refetch, isFetching } = useGetDailySummaryQuery(
    { id: id ?? '' },
    {
      enabled: Boolean(id),
    },
  )

  const pdfDocument = React.useMemo(() => {
    if (!data) {
      return null
    }

    return <PdfDailySummaryDocument data={data} />
  }, [data])

  const downloadFileName = React.useMemo(() => {
    if (!data) {
      return 'daily-summary.pdf'
    }

    return `일간 리포트 ${data.aiReportInfo.generatedAt}.pdf`
  }, [data])

  const handleNewsLinkClick = React.useCallback((link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }, [])

  const handleRetryClick = React.useCallback(() => {
    refetch()
  }, [refetch])

  if (!id) {
    return (
      <ReportStatusMessage
        title="리포트 식별자가 필요합니다."
        description="URL을 확인하거나 담당자에게 문의해주세요."
        tone="error"
      />
    )
  }

  if (isLoading && !data) {
    return (
      <ReportStatusMessage
        title="일간 요약 리포트를 준비 중입니다."
        description="잠시만 기다려주세요."
      />
    )
  }

  if (isError) {
    return (
      <ReportStatusMessage
        title="데이터를 불러오지 못했습니다."
        description={(error as Error)?.message ?? '다시 시도해주세요.'}
        tone="error"
        actionLabel="다시 시도"
        onAction={handleRetryClick}
        isPerformingAction={isFetching}
      />
    )
  }

  if (!data || !pdfDocument) {
    return (
      <ReportStatusMessage
        title="일간 요약 리포트를 찾을 수 없습니다."
        description="선택한 날짜의 리포트가 존재하지 않습니다."
        tone="error"
      />
    )
  }

  return (
    <ReportPageLayout
      header={<Header />}
      pdfDocument={pdfDocument}
      pdfFileName={downloadFileName}
      pageClassName="bg-gray-50"
      contentClassName="px-8 pt-8 pb-20"
      downloadButtonWrapperClassName="right-10"
      downloadButtonProps={{
        icon: <FileDown className="h-4 w-4 text-white" aria-hidden="true" />,
      }}
    >
      <div className="mx-auto w-full max-w-[721px] rounded-lg bg-white shadow-sm">
        <div className="flex flex-col gap-6 pb-7">
          <div className="flex items-start justify-between">
            <div className="w-full flex-1">
              <ReportHeader title={data.title} aiReportInfo={data.aiReportInfo} />
            </div>
          </div>

          <KeywordsSection keywords={data.marketKeywords} />

          <NewsSection news={data.topNews} onLinkClick={handleNewsLinkClick} />

          <MarketTrendsSection marketTrends={data.marketTrends} />

          <GlobalIndicesSection indices={data.globalIndices} />

          <ExchangeRatesSection exchangeRates={data.exchangeRates} />

          <CommodityPricesSection commodityPrices={data.commodityPrices} />

          <AiInsightsSection insights={data.aiInsights} />

          <NoticeSection />
        </div>
      </div>
      {(isLoading || isFetching) && (
        <div className="mt-6 text-center text-sm font-medium text-slate-500" aria-live="polite">
          데이터를 최신 상태로 갱신 중입니다...
        </div>
      )}
    </ReportPageLayout>
  )
}

export default DailySummaryPage
