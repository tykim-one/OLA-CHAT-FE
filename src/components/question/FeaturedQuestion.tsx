'use client'

import React from 'react'

import { ChevronRightIcon } from '@heroicons/react/24/outline'

import { Card, CardContent } from '@/components/ui/card'

import { FeaturedQuestionProps } from '@/types'

/**
 * 강조된 추천 질문 컴포넌트
 * 메인 화면 상단에 표시되는 특별한 질문입니다.
 */
export default function FeaturedQuestion({ text, onClick }: FeaturedQuestionProps) {
  return (
    <Card
      onClick={onClick}
      className={`
        bg-blue-50 border-2 border-blue-200 mb-6
        cursor-pointer transition-all duration-200
        hover:bg-blue-100 hover:border-blue-300 hover:shadow-sm
        group
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-blue-700 font-medium text-sm leading-relaxed flex-1 pr-3">
            {text}
          </span>
          <ChevronRightIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  )
}
