import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { api } from '@/lib/http'

import { MainPageViewModel, ReportItem } from '@/types/main'

export const useMainPageViewModel = (): MainPageViewModel => {
  const router = useRouter()
  const [contentMeta, setContentMeta] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)

  // 리포트 메타데이터를 가져오는 함수
  const fetchContentMeta = async (): Promise<void> => {
    try {
      setLoading(true)
      // localStorage 접근을 useEffect 안에서 수행
      const token = localStorage.getItem('auth_token')

      if (!token) {
        // console.error('No auth token found')
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_IBK_PUBLIC_URL}/ibk/content-meta`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      // 401 에러 처리: 인증 정보 초기화 및 로그인 페이지로 리다이렉트
      if (response.status === 401) {
        // 인증 토큰 제거
        localStorage.removeItem('auth_token')
        // 로그인 페이지로 리다이렉트
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // 데이터가 배열인지 확인
      if (Array.isArray(data)) {
        setContentMeta(data)
      } else if (data && Array.isArray(data.items)) {
        // API가 { items: [...] } 형태로 반환하는 경우
        setContentMeta(data.items)
      } else if (data && Array.isArray(data.data)) {
        // API가 { data: [...] } 형태로 반환하는 경우
        setContentMeta(data.data)
      } else {
        console.error('API response is not an array:', data)
        setContentMeta([]) // 빈 배열로 설정
      }
    } catch (error) {
      console.error('Error fetching content meta:', error)
      setContentMeta([]) // 에러 시 빈 배열로 설정
    } finally {
      setLoading(false)
    }
  }

  // localStorage 데이터를 정리하는 함수
  const clearLocalStorageData = (): void => {
    localStorage.removeItem('reportBasicInfo')
    localStorage.removeItem('reportTemplateId')
    localStorage.removeItem('reportDataSourceFull')
    localStorage.removeItem('reportDataSource')
    localStorage.removeItem('reportContentConfig')
  }

  // 새 리포트 작성 핸들러
  const handleNewReport = (): void => {
    router.push('/report')
  }

  // 리포트 삭제 핸들러
  const handleDeleteReport = async (reportId: string): Promise<void> => {
    try {
      await api.delete(`/ibk/content-meta/${reportId}`)
      // 삭제 후 목록 새로고침
      await fetchContentMeta()
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  // 리포트 클릭 핸들러
  const handleReportClick = (reportId: string): void => {
    router.push(`/report/completed/${reportId}`)
  }

  // 초기화 로직
  useEffect(() => {
    fetchContentMeta()
    clearLocalStorageData()
  }, [])

  return {
    // 상태
    contentMeta,
    loading,

    // 핸들러
    handleNewReport,
    handleDeleteReport,
    handleReportClick,
  }
}
