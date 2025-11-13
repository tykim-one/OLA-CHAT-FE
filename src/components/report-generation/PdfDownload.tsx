// ReportPdfDownload.tsx
import { PDFDownloadLink } from '@react-pdf/renderer'

import { PdfReportDocument } from './PdfReportDocument'

type PortfolioData = {
  recommendedProducts: {
    funds?: Array<{
      name: string
      investment_point: string
      type?: string
    }>
    etfs?: Array<{
      name: string
      investment_point: string
      type?: string
    }>
  }
  performanceRows: Array<{
    name: string
    price: string
    return3m: string
    return6m: string
    return1y: string
    return2y: string
  }>
}

type ReportMeta = {
  title: string
  period: 'daily' | 'weekly' | 'monthly'
}

type ReportPdfDownloadProps = {
  data: any
  portfolioData: PortfolioData
  reportMeta: ReportMeta
}

export default function ReportPdfDownload({
  data,
  portfolioData,
  reportMeta,
}: ReportPdfDownloadProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* PDF 다운로드 */}
      <PDFDownloadLink
        document={
          <PdfReportDocument data={data} portfolioData={portfolioData} reportMeta={reportMeta} />
        }
        fileName={`${reportMeta.title}.pdf`}
        className="rounded-xl bg-[#e6f1ff] cursor-pointer border border-[#003f89] text-[#004ca5] px-4 py-2 shadow textbase font-bold"
        onClick={() => {
          alert(
            '해당 리포트는 고객에게 제공이 불가하며, 상담 준비 용도로만 활용이 가능한 행내한 자료입니다.',
          )
        }}
      >
        {({ blob, url, loading }) => (loading ? '생성 중…' : 'PDF 다운로드')}
      </PDFDownloadLink>
    </div>
  )
}
