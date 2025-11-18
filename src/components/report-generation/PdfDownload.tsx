// ReportPdfDownload.tsx
import { PDFDownloadLink } from '@react-pdf/renderer'

import { PdfReportDocument } from './PdfReportDocument'
import { Download, Loader } from 'lucide-react'

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
        className="rounded-xl bg-white text-black border border-gray-300 hover:bg-gray-200 px-3 py-2 cursor-pointer"
        onClick={() => {
          alert(
            '해당 리포트는 고객에게 제공이 불가하며, 상담 준비 용도로만 활용이 가능한 행내한 자료입니다.',
          )
        }}
      >
       
        {({ blob, url, loading }) => (loading ? <div className="flex items-center gap-2"><Loader className="h-4 w-4 text-black" aria-hidden="true" />생성 중…</div> : <div className="flex items-center gap-2 text-xs"><Download className="h-4 w-4 !text-black" aria-hidden="true" />PDF 다운로드</div>)}
      </PDFDownloadLink>
    </div>
  )
}
