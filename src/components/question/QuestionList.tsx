'use client'

import React from 'react'

import { ArrowRight } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

import { QuestionListProps } from '@/types'

/**
 * 추천 질문 목록 컴포넌트
 * 메인 화면에서 사용자가 선택할 수 있는 질문들을 표시합니다.
 */
export default function QuestionList({ questions, onQuestionClick }: QuestionListProps) {
  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        // 첫 번째 질문은 기본적으로 활성화된 상태로 표시
        const isActive = index === 0

        return (
          <Card
            key={index}
            onClick={() => onQuestionClick?.(question.text)}
            className={`cursor-pointer transition-all duration-200 group px-4 py-3 rounded-[6px]
              ${
                isActive
                  ? 'border-[#059DD6] text-[#059DD6]' // 첫 번째 질문 - 기본 활성화 상태
                  : 'border-[#E6EBF1] text-gray-700 hover:border-[#059DD6] hover:text-[#059DD6] hover:shadow-sm' // 나머지 질문들 - hover 시 활성화
              }
            `}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between space-x-[120px]">
                <p className="text-base leading-normal font-medium text-slate-900">
                  {question.text}
                </p>
                {question.hasArrow && (
                  <ArrowRight
                    className={`h-5 w-5 transition-colors flex-shrink-0 ${
                      isActive
                        ? 'text-[#059DD6]' // 첫 번째 질문의 화살표
                        : 'text-black group-hover:text-[#059DD6]' // 나머지 질문들의 화살표
                    }`}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
