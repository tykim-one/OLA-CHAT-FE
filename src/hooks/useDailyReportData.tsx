import { useEffect, useState } from 'react'

import { transformDailyReportResponseDTO } from '@/hooks/data-fetching/daily-report/transforms'
import { getDailyReport } from '@/services/daily-report/api'
import type { DailyReportData } from '@/types/dailyReport'

interface UseDailyReportDataParams {
  id: string
}

interface UseDailyReportDataResult {
  report: DailyReportData | null
  loading: boolean
  error: string | null
}

export const useDailyReportData = ({ id }: UseDailyReportDataParams): UseDailyReportDataResult => {
  const [report, setReport] = useState<DailyReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setReport(null)
      setError('리포트를 찾을 수 없습니다.')
      setLoading(false)
      return
    }

    const fetchReport = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getDailyReport({ id })
        const parsed = transformDailyReportResponseDTO(response)

        setReport(parsed)
      } catch (fetchError) {
        console.error('데일리 리포트를 불러오는데 실패했습니다.', fetchError)
        setReport(null)
        setError('리포트를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [id])

  return { report, loading, error }
}

