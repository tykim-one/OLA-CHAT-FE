import { useCallback } from 'react'

import { ReportSectionTitle } from './ReportSectionTitle'
import { getChartTitle } from './chart'

import type { DailyReportGraph, DailyReportTheme } from '@/types/dailyReport'

interface ReportGraphSectionProps {
  // 그래프 데이터 배열
  graphItems: DailyReportGraph[]
  // 그래프가 속한 테마 (텍스트 표기에 사용)
  theme: DailyReportTheme
}

export const ReportGraphSection = ({ graphItems, theme }: ReportGraphSectionProps) => {
  const hasGraphItems = graphItems.length > 0

  const handleGraphOpen = useCallback((url: string) => {
    window.open(url, '_blank')
  }, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>, url: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    handleGraphOpen(url)
  }, [handleGraphOpen])

  if (!hasGraphItems) {
    return (
      <section className="space-y-4">
        <ReportSectionTitle title="그래프 데이터" />

        <div className="flex gap-3">
          <div className="flex h-[138px] w-[321px] items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-slate-500">
            그래프 데이터를 불러올 수 없습니다.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <ReportSectionTitle title="그래프 데이터" />

      <div className="flex gap-3">
        {graphItems.map((graphItem, index) => {
          const chartTitle = getChartTitle({ graphItem, index })
          const displayPeriodText = theme === 'FOREX' ? '1달간' : '7일간'
          const accessibleLabel = `${chartTitle} ${displayPeriodText} 가격변동 그래프`

          return (
            <div key={`${graphItem.url}-${index}`} className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-base font-medium text-slate-600">
                <p className="font-bold">{chartTitle}</p>
                {displayPeriodText} 가격변동
              </span>
              <div
                role="button"
                tabIndex={0}
                aria-label={accessibleLabel}
                className="outline-none"
                onClick={() => handleGraphOpen(graphItem.url)}
                onKeyDown={(event) => handleKeyDown(event, graphItem.url)}
              >
                <img
                  src={graphItem.url}
                  alt={`${chartTitle} 그래프`}
                  width={321}
                  height={138}
                  className="h-[138px] w-[321px] rounded object-cover"
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}


