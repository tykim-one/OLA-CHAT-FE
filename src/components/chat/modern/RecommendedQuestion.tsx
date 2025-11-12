'use client'

import { SendHorizonal, SendIcon, Wand } from 'lucide-react'

interface RecommendedQuestionProps {
  title: string
  questions: string[]
  onQuestionClick?: (question: string) => void
  className?: string
}

/**
 * 추천 질문 컴포넌트
 * 검은 배경에 밝은 회색 텍스트와 파란색 아이콘을 사용하는 스타일
 */
export default function RecommendedQuestion({
  title,
  questions,
  onQuestionClick,
  className = '',
}: RecommendedQuestionProps) {
  const handleQuestionClick = (question: string) => {
    onQuestionClick?.(question)
  }

  return (
    <div className={`bg-transparent rounded-lg ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
        <Wand className="w-6 h-6 text-slate-900" />
        <h3 className="text-slate-900 text-tableHead">{title}</h3>
      </div>

      {/* 질문 리스트 */}
      <div className="space-y-0">
        {questions.map((question, index) => (
          <div key={index}>
            <button
              onClick={(e) => {
                e.preventDefault()
                handleQuestionClick(question)
              }}
              className="!cursor-pointer
                flex items-center justify-between w-full px-3.5 py-3
                hover:bg-slate-50 hover:text-slate-700
                focus:bg-slate-50 focus:text-slate-700
                transition-all duration-200 group
              "
              aria-label={`질문하기: ${question}`}
            >
              <span className="text-left text-slate-900 text-body-medium group-hover:text-slate-700 transition-colors duration-200">
                {question}
              </span>

              {/* 파란색 종이비행기 아이콘 */}
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-200"
              >
                <path
                  d="M2.05389 3.37755C2.23334 3.19446 2.50608 3.13943 2.74237 3.23887L18.5754 9.90587C18.807 10.0034 18.958 10.2298 18.9582 10.4811C18.9582 10.7325 18.8071 10.9597 18.5754 11.0572L2.74237 17.7242C2.50614 17.8236 2.23332 17.7685 2.05389 17.5856C1.8745 17.4025 1.82474 17.1283 1.92889 16.8941L4.50604 11.1061H10.8332C11.1784 11.1061 11.4582 10.8262 11.4582 10.4811C11.458 10.1361 11.1782 9.85606 10.8332 9.85606H4.50604L1.92889 4.06895C1.82465 3.83472 1.87445 3.56069 2.05389 3.37755Z"
                  fill="#3B82F6"
                />
              </svg>
            </button>

            {/* 구분선 (마지막 항목 제외) */}
            <div className="border-t border-slate-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
