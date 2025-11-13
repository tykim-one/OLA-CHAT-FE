import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ContentConfigData } from '@/types/report'

export interface ContentPageViewModel {
  // States
  initialData: ContentConfigData | undefined
  isLoading: boolean
  error: string | null

  // Actions
  handleSubmit: (data: ContentConfigData) => void
  clearError: () => void
}

export const useContentPageViewModel = (): ContentPageViewModel => {
  const router = useRouter()
  const [initialData, setInitialData] = useState<ContentConfigData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 에러 상태 관리
  const clearError = () => {
    setError(null)
  }

  // 비즈니스 로직: 데이터 제출 처리
  const handleSubmit = (data: ContentConfigData) => {
    try {
      setError(null)
      // 콘텐츠 설정 저장
      localStorage.setItem('reportContentConfig', JSON.stringify(data))
      router.push('/report/preview')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '데이터 저장 중 오류가 발생했습니다.'
      console.error('데이터 저장 중 오류:', error)
      setError(errorMessage)
    }
  }

  // 비즈니스 로직: 초기 데이터 로드
  const loadInitialData = (): ContentConfigData | undefined => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('reportContentConfig')
        if (savedData) {
          return JSON.parse(savedData)
        }
      } catch (error) {
        console.error('초기 데이터 로드 중 오류:', error)
        setError('저장된 데이터를 불러오는 중 오류가 발생했습니다.')
      }
    }
    return undefined
  }

  // 비즈니스 로직: 필수 데이터 검증
  const checkRequiredData = (): boolean => {
    if (typeof window === 'undefined') return false

    try {
      // 1. 기본 정보 확인
      const basicInfoStr = localStorage.getItem('reportBasicInfo')
      if (!basicInfoStr) return false

      const basicInfo = JSON.parse(basicInfoStr)
      if (!basicInfo.reportType || !basicInfo.period) {
        return false
      }

      // 2. 템플릿 ID 확인
      const templateId = localStorage.getItem('reportTemplateId')
      if (!templateId) return false

      // 3. 데이터 소스 확인
      const dataSourceStr = localStorage.getItem('reportDataSource')
      if (!dataSourceStr) return false

      return true
    } catch (error) {
      console.error('데이터 체크 중 오류:', error)
      return false
    }
  }

  // 초기화 로직
  useEffect(() => {
    const initializeViewModel = async () => {
      try {
        setError(null) // 초기화 시 에러 상태 리셋

        // 이전 단계 정보 체크
        const hasRequiredData = checkRequiredData()
        if (!hasRequiredData) {
          setError('이전 단계의 정보가 누락되었습니다. 처음부터 다시 시작해주세요.')
          router.push('/')
          return
        }

        // 기존 데이터 로드
        const data = loadInitialData()
        setInitialData(data)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'ViewModel 초기화 중 오류가 발생했습니다.'
        console.error('ViewModel 초기화 중 오류:', error)
        setError(errorMessage)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    initializeViewModel()
  }, [router])

  return {
    // States
    initialData,
    isLoading,
    error,

    // Actions
    handleSubmit,
    clearError,
  }
}
