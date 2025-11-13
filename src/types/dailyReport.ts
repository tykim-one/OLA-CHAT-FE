// 뉴스 데이터 타입
export interface NewsItem {
  title: string
  source?: string
  link?: string
  publishedDate?: string
}

// 테이블 셀 타입
export type TableTextCellValue = string

export interface TableColoredCellValue {
  value: string
  color: string
}

export interface TableChangeMetricCellValue {
  diff: string
  changeValue: string
  unit: string
}

export type TableCellValue =
  | TableTextCellValue
  | TableColoredCellValue
  | TableChangeMetricCellValue

// 테이블 행 데이터 타입
export type TableRow = Record<string, TableCellValue>

// 테이블 데이터 타입
export interface TableData {
  headers: string[]
  rows: TableRow[]
}

export interface DailyReportGraph {
  url: string
  title: string
  date: string
  theme?: string
}

// 일일 리포트 데이터 타입
export type DailyReportTheme = 'FOREX' | 'AI' | 'DIVIDEND' | 'GENERAL'

export interface DailyReportData {
  id: string
  theme: DailyReportTheme
  title: string
  date: string
  newsData: NewsItem[]
  tableData: TableData
  analysisData: string
  graphData: DailyReportGraph[]
}

export interface DailyReportMetaInfo {
  id: string
  theme: DailyReportTheme
  title: string
  date: string
}

// DailyReportContainer 컴포넌트 Props 타입
export interface DailyReportContainerProps {
  id: string
  theme: DailyReportTheme
  title: string
  date: string
  newsData: NewsItem[]
  tableData: TableData
  analysisData: string
  graphData?: DailyReportGraph[]
}
