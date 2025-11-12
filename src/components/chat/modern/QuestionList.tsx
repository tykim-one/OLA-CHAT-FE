'use client'

import { ArrowRightIcon } from 'lucide-react'

import { QuestionListProps } from '@/types/modern-chat'

/**
 * 추천 질문 목록 컴포넌트
 * Figma 디자인의 질문 버블들을 구현
 */
export default function QuestionList({
  questions,
  onQuestionClick,
  className = '',
  activeTab,
}: QuestionListProps) {
  const handleQuestionClick = (question: string) => {
    onQuestionClick(question)
  }

  const handleKeyDown = (event: React.KeyboardEvent, question: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleQuestionClick(question)
    }
  }

  // 순위 텍스트 생성 함수 (1st, 2nd, 3rd, 4th 등)
  const getRankText = (index: number) => {
    const rank = index + 1
    if (rank === 1) return '1st'
    if (rank === 2) return '2nd'
    if (rank === 3) return '3rd'
    return `${rank}th`
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {activeTab === 'recommended' && (
        <p className="text-body-medium">한 눈에 보는 오늘의 추천 질문!</p>
      )}
      {activeTab === 'popular' && (
        <p className="text-body-medium">지금 챗봇 사용자들이 가장 많이 묻고 있어요.</p>
      )}

      {questions.map((question, index) => (
        <button
          key={question.id}
          onClick={() => handleQuestionClick(question.text)}
          // onKeyDown={(e) => handleKeyDown(e, question.text)}
          className="!cursor-pointer !important
            flex items-center justify-between w-full px-3.5 py-1.5 
            bg-white border border-slate-200 rounded-[18px] 
            text-body-medium text-slate-900 
            hover:bg-slate-50 hover:border-slate-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            transition-all duration-200
            group
          "
          aria-label={`질문하기: ${question.text}`}
          style={{ cursor: 'pointer' }}
        >
          <span className="text-left flex-1">
            {/* 인기 질문일 때 순위 표시 */}
            {activeTab === 'popular' && (
              <span
                className={`inline-block font-semibold mr-2 w-[28px] text-center ${
                  index === 0 ? 'text-blue-500' : 'text-blue-800'
                }`}
              >
                {getRankText(index)}
              </span>
            )}
            {question.text}
          </span>

          {/* 화살표 아이콘 */}
          <ArrowRightIcon className="h-5 w-5 transition-colors flex-shrink-0 text-slate-500" />
        </button>
      ))}
    </div>
  )
}
