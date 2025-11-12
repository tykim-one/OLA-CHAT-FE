/**
 * 질문 관련 타입 정의
 */

export interface QuestionItem {
  id: string
  text: string
  category: string
  hasArrow?: boolean
  isPopular?: boolean
  createdAt?: Date
}

export interface QuestionCategory {
  id: string
  name: string
  description?: string
  questions: QuestionItem[]
}

export interface QuestionConfig {
  categories: QuestionCategory[]
  popularQuestions: QuestionItem[]
  recommendedQuestions: QuestionItem[]
}
