'use client'

import { useParams } from 'next/navigation'
import React from 'react'

import { Download, FileDown } from 'lucide-react'
import { PDFViewer } from '@react-pdf/renderer'

import { PdfDailySummaryDocument } from '@/components/report-generation/PdfDailySummaryDocument'
import { ReportPageLayout, ReportStatusMessage } from '@/components/report/shared'
import Header from '@/components/shared/Header'

import { useGetDailySummaryQuery } from '@/hooks/data-fetching/daily'
import { DailySummaryData } from '@/types/dailySummary'

// DailySummary PDF 뷰어 컴포넌트
export const DailySummaryPdfViewer = ({ data }: { data: DailySummaryData }) => {
  return (
    <div className="w-full py-2 flex justify-center bg-transparent overflow-hidden rounded-lg items-center">
      <PDFViewer 
        width="721px" 
        showToolbar={false}
        className="border-none bg-transparent w-[721px] md:h-[3250px] h-[1400px] flex justify-center md:py-24 py-0"
        
      >
        <PdfDailySummaryDocument data={data} />
      </PDFViewer>
    </div>
  )
}

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
      contentClassName="pt-8 pb-20"
      downloadButtonWrapperClassName="right-10"
      downloadButtonProps={{
        icon: <Download className="h-4 w-4 text-black" aria-hidden="true" />,
      }}
    >
      <div className="mx-auto max-w-[1024px] w-full h-full">
        <DailySummaryPdfViewer data={data} />
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
