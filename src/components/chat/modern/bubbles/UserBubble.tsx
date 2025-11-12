'use client'

import { ChatTextMessage } from '@/types'

interface UserBubbleProps {
  message: ChatTextMessage
  className?: string
}

/**
 * 사용자 메시지 버블 컴포넌트
 * Figma 디자인의 사용자 질문 버블을 구현
 */
export default function UserBubble({ message, className = '' }: UserBubbleProps) {
  return (
    <div className={`flex justify-end w-full ${className}`}>
      <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 rounded-[18px] max-w-[80%]">
        <span className="text-body-medium text-slate-900">{message.content}</span>
      </div>
    </div>
  )
}
