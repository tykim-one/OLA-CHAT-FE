'use client'

import { LoadingBubbleProps } from '@/types/modern-chat'

import LoadingDots from '../LoadingDots'

/**
 * AI 응답 로딩 중 표시되는 버블 컴포넌트
 * Figma 디자인의 로딩 상태를 구현
 */
export default function LoadingBubble({
  message,
  showDots = true,
  className = '',
}: LoadingBubbleProps) {
  return (
    <div className={`flex justify-center items-center w-full gap-1.5 ${className}`}>
      {/* 로딩 점 애니메이션 */}
      {showDots && (
        <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-[20px] p-2.5 shadow-sm">
          <LoadingDots />
        </div>
      )}

      {/* 로딩 메시지 */}
      <div className="flex-1">
        <p
          className="
          text-sm font-medium
          bg-gradient-to-r from-slate-900 via-slate-500 to-slate-100
          bg-clip-text text-transparent
          animate-gradient-shimmer
          bg-[length:300%_100%]
          bg-[position:300%_0]
          transition-all duration-2000
          drop-shadow-sm
        "
        >
          {message}
        </p>
      </div>
    </div>
  )
}
