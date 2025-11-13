import { useMemo } from 'react'

import { DailyReportTable } from '../DailyReportTable'

import { ReportSectionTitle } from './ReportSectionTitle'

import type { TableRow } from '@/types/dailyReport'

interface ReportTableSectionProps {
  // 섹션 제목
  title: string
  // 테이블 헤더 배열
  headers: string[]
  // 모든 테이블 행 데이터
  rows: TableRow[]
  theme?: string
}

// 테이블 줄 수에 따라 적절한 chunk size를 계산하는 함수
const getChunkSize = (totalItems: number): number => {
  if (totalItems <= 0) {
    return 0
  }

  if (totalItems <= 4) {
    return totalItems
  }

  if (totalItems <= 6) {
    return 3
  }

  return 4
}

// 줄 수를 균등하게 나누기 위한 공통 chunk 함수
const chunkRows = <T,>(items: T[], size: number): T[][] => {
  if (size <= 0) {
    return []
  }

  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  if (chunks.length === 0) {
    return [items]
  }

  return chunks
}

export const ReportTableSection = ({ title, headers, rows, theme }: ReportTableSectionProps) => {
  const chunkSize = useMemo(() => getChunkSize(rows.length), [rows.length])
  const rowGroups = useMemo(() => chunkRows(rows, chunkSize), [rows, chunkSize])
  const hasSingleGroup = rowGroups.length === 1

  return (
    <section className="space-y-4">
      <ReportSectionTitle title={title} />

      <div className={`flex gap-4 ${hasSingleGroup ? 'w-full' : ''}`}>
        {rowGroups.map((rowGroup, index) => (
          <div key={`report-table-section-${index}`} className="w-full">
            <DailyReportTable headers={headers} rows={rowGroup} theme={theme} />
          </div>
        ))}
      </div>
    </section>
  )
}


