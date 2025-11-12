import { useCallback, useEffect, useState } from 'react'

import { QuestionConfig, QuestionItem } from '@/types/question/question'

import { mockQuestions, mockTabOptions } from '@/constants'

/**
 * 질문 데이터를 관리하는 훅
 */
export interface UseQuestionsReturn {
  // 상태
  questions: QuestionItem[]
  questionConfig: QuestionConfig | null
  tabOptions: any[]
  isLoading: boolean
  error: string | null

  // 액션
  refreshQuestions: () => Promise<void>
  getQuestionsByCategory: (category: string) => QuestionItem[]
  clearError: () => void
}

export function useQuestions(): UseQuestionsReturn {
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [questionConfig, setQuestionConfig] = useState<QuestionConfig | null>(null)
  const [tabOptions, setTabOptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 질문 데이터 로드
  const loadQuestions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 병렬로 데이터 로드

      const mockQuestionConfig: QuestionConfig = {
        categories: [
          {
            id: 'recommended',
            name: '추천 질문',
            questions: questions.filter((q) => q.category === 'recommended'),
          },
        ],
        popularQuestions: questions.filter((q) => q.category === 'popular'),
        recommendedQuestions: questions.filter((q) => q.category === 'recommended'),
      }

      setQuestions(mockQuestions)
      setQuestionConfig(mockQuestionConfig)
      setTabOptions(mockTabOptions)
    } catch (error) {
      console.error('질문 데이터 로드 실패:', error)
      setError('질문 데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 카테고리별 질문 필터링
  const getQuestionsByCategory = useCallback(
    (category: string): QuestionItem[] => {
      return questions.filter((q) => q.category === category)
    },
    [questions],
  )

  // 데이터 새로고침
  const refreshQuestions = useCallback(async () => {
    await loadQuestions()
  }, [loadQuestions])

  // 에러 해제
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // 초기 로드
  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  return {
    // 상태
    questions,
    questionConfig,
    tabOptions,
    isLoading,
    error,

    // 액션
    refreshQuestions,
    getQuestionsByCategory,
    clearError,
  }
}
