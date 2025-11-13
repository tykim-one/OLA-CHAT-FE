import { useMemo } from 'react'

import { DailyReportTable } from '../DailyReportTable'

import { ReportSectionTitle } from './ReportSectionTitle'

import type { TableRow } from '@/types/dailyReport'

interface ReportTablesSectionProps {
  // 섹션 제목
  title: string
  // 테이블 헤더 배열
  headers: string[]
  // 테이블 전체 행 데이터
  rows: TableRow[]
}

// 테이블 행의 개수를 기반으로 chunk size를 계산합니다.
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

// 배열을 지정된 크기로 나누는 공통 함수
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

export const ReportTablesSection = ({ title, headers, rows }: ReportTablesSectionProps) => {
  const chunkSize = useMemo(() => getChunkSize(rows.length), [rows.length])
  const rowGroups = useMemo(() => chunkRows(rows, chunkSize), [rows, chunkSize])
  const hasSingleGroup = rowGroups.length === 1

  return (
    <section className="space-y-4">
      <ReportSectionTitle title={title} />

      <div className={`flex gap-4 ${hasSingleGroup ? 'w-full' : ''}`}>
        {rowGroups.map((rowGroup, index) => (
          <div key={`report-table-${index}`} className="w-full">
            <DailyReportTable headers={headers} rows={rowGroup} />
          </div>
        ))}
      </div>
    </section>
  )
}



