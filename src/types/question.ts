/**
 * 질문 관련 타입 정의
 * 기존 호환성을 위해 유지하되, 새로운 통합된 타입을 re-export
 */
export interface Question {
  id?: string
  text: string
  hasArrow: boolean
  category?: string
  priority?: number
}

/**
 * 추천 질문 Props 타입
 */
export interface FeaturedQuestionProps {
  text: string
  onClick?: () => void
}

/**
 * 질문 목록 Props 타입
 */
export interface QuestionListProps {
  questions: Question[]
  onQuestionClick?: (question: string) => void
}

/**
 * 메인 콘텐츠 Props 타입
 */
export interface MainContentProps {
  title?: string
  description?: string
  questions: Question[]
  onQuestionClick: (questionText: string) => void
  iframeUrl?: string
  onCloseIframe?: () => void

  // 공시 데이터 관련 추가 필드
  disclosureData?: string[]
  onDisclosureSelect?: (rcept_no: string) => void
}

// 새로운 통합된 타입들을 re-export
export * from './question/question'
