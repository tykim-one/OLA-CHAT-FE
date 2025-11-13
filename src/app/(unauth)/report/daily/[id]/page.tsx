'use client'

import { useParams } from 'next/navigation'
import React from 'react'

import { PdfDailyReportDocument } from '@/components/report-generation/PdfDailyReportDocument'
import { DailyReportContainer } from '@/components/report/DailyReportContainer'
import { ReportPageLayout, ReportStatusMessage } from '@/components/report/shared'
import Header from '@/components/shared/Header'

import { useDailyReportData } from '@/hooks/useDailyReportData'
import { DailyReportData } from '@/types/dailyReport'
import { PDFViewer } from '@react-pdf/renderer'

const loadingDescription = '데일리 리포트를 불러오는 중입니다. 잠시만 기다려주세요.'
const errorDescription = '리포트를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'

const DailyReportPage: React.FC = () => {
  const params = useParams()
  const id = params?.id as string | undefined

  const { report, loading, error } = useDailyReportData({ id: id ?? '' })

  const ReportPdfViewer = ({ reportData }: { reportData: DailyReportData }) => {
    return (
      <div className="w-full h-screen py-2 flex justify-center bg-transparent overflow-hidden rounded-lg items-center">
        <PDFViewer 
          width="721px" 
          height="100%"
          showToolbar={false}
          
          className="border-none bg-transparent w-[721px] h-screen overflow-hidden flex justify-center"
       
        >
          <PdfDailyReportDocument report={reportData} />
        </PDFViewer>
      </div>
    );
  };
  
  if (!id) {
    return (
      <ReportStatusMessage
        title="리포트 식별자가 필요합니다."
        description="URL을 확인하거나 담당자에게 문의해주세요."
        tone="error"
      />
    )
  }

  if (loading) {
    return (
      <ReportStatusMessage
        title="데일리 리포트를 불러오는 중..."
        description={loadingDescription}
      />
    )
  }

  if (error) {
    return (
      <ReportStatusMessage
        title="데일리 리포트를 가져오지 못했습니다."
        description={errorDescription}
        tone="error"
      />
    )
  }

  if (!report) {
    return (
      <ReportStatusMessage
        title="데일리 리포트를 찾을 수 없습니다."
        description="선택한 날짜의 리포트가 존재하지 않습니다."
        tone="error"
      />
    )
  }

  return (
    <ReportPageLayout
      header={<Header />}
      pdfDocument={
        <PdfDailyReportDocument
          report={{
            id: report.id,
            theme: report.theme,
            title: report.title,
            date: report.date,
            newsData: report.newsData,
            tableData: report.tableData,
            analysisData: report.analysisData,
            graphData: report.graphData,
          }}
        />
      }
      pdfFileName={`${report.title}_${report.date.replace(/\./g, '')}.pdf`}
      pageClassName="bg-Grayscale-B50 font-pretendard"
      contentClassName="h-full w-full"
      downloadButtonWrapperClassName="right-10"
    >
      <div className="mx-auto max-w-[1024px] w-full h-full">
        {/* <DailyReportContainer
          id={report.id}
          theme={report.theme}
          title={report.title}
          date={report.date}
          newsData={report.newsData}
          tableData={report.tableData}
          analysisData={report.analysisData}
          graphData={report.graphData}
        /> */}
        <ReportPdfViewer reportData={report} />
      </div>
    </ReportPageLayout>
  )
}

export default DailyReportPage
