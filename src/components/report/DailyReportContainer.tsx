
import { normalizeAnalysisMarkdown } from '@/utils/analysisMarkdown'

import type { DailyReportContainerProps } from '@/types/dailyReport'

import { DailyReportHeader } from './DailyReportHeader'
import {
  ReportAnalysisSection,
  ReportGraphSection,
  ReportNewsSection,
  ReportTableSection,
  getReportThemeConfig,
} from './shared'

export const DailyReportContainer = ({
  id,
  theme,
  title,
  date,
  newsData,
  tableData,
  analysisData,
  graphData = [],
}: DailyReportContainerProps) => {
  const themeConfig = getReportThemeConfig(theme)
  const normalizedAnalysis = normalizeAnalysisMarkdown(analysisData)
  const hasNewsData = newsData.length > 0

  return (
    <div className="bg-white relative mb-[50px] px-0 pb-10 pt-0 flex flex-col border border-grayscale-b100 max-w-[721px] w-full justify-self-center mx-auto">
      {/* 헤더 영역 */}
      <DailyReportHeader
        title={`IBK 자산관리 How’s: ${title}`}
        highlightWord={themeConfig.highlightWord}
        date={date}
        theme={theme}
      />
      <img src="/header-b-border.png" alt="header-b-border" width={721} height={1} />
      {/* 구분선 */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />

      {/* 컨텐츠 영역 - 고정 사이즈로 제한 */}
      <div className="flex-1 px-9 py-8 space-y-3">
        <ReportNewsSection title={themeConfig.newsTitle} items={newsData} />

        <ReportAnalysisSection
          title={themeConfig.analysisTitle}
          markdown={normalizedAnalysis}
          canDisplayAnalysis={hasNewsData}
        />

        <ReportTableSection
          title={themeConfig.tableTitle}
          headers={tableData.headers}
          rows={tableData.rows}
          theme={theme}
        />

        <ReportGraphSection graphItems={graphData} theme={theme} />
      </div>
    </div>
  )
}
