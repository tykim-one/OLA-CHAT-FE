import React from 'react'

import ReactMarkdown from 'react-markdown'

import { theme } from '@/lib/theme'

/**
 * 메시지 컴포넌트의 Props 타입 정의
 */
interface MessageProps {
  /** 메시지 내용 */
  content: string
  /** 메시지 타입 (사용자 또는 시스템) */
  variant?: 'user' | 'system' | 'assistant'
  /** 메시지 시간 */
  timestamp?: string
  /** 추가 액션 버튼 */
  actionButton?: {
    text: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'primary' | 'secondary' | 'outline'
  }
  /** 아바타 또는 프로필 이미지 */
  avatar?: React.ReactNode
  /** 마크다운 렌더링 여부 */
  enableMarkdown?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 재사용 가능한 Message 컴포넌트
 * 다양한 메시지 타입과 스타일을 지원하여 채팅, 알림, 댓글 등에서 사용할 수 있습니다.
 */
export default function Message({
  content,
  variant = 'system',
  timestamp,
  actionButton,
  avatar,
  enableMarkdown = false,
  className = '',
}: MessageProps) {
  // 변형별 스타일 클래스
  const variantStyles = {
    user: {
      container: 'flex justify-end',
      message: `
        bg-[${theme.colors.primary}] text-white
        rounded-lg rounded-br-sm
        px-4 py-3 max-w-[85%]
        shadow-sm
      `,
    },
    assistant: {
      container: 'flex justify-start',
      message: `
        bg-white text-gray-800 
        rounded-lg rounded-bl-sm
        px-4 py-3 max-w-[85%]
        shadow-sm border border-gray-100
        prose prose-sm max-w-none
      `,
    },
    system: {
      container: 'flex justify-center',
      message: `
        bg-gray-100 text-gray-600
        rounded-lg px-3 py-2
        text-sm text-center
        max-w-[70%]
      `,
    },
  }

  const styles = variantStyles[variant]

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 메시지 컨테이너 */}
      <div className={styles.container}>
        {/* 아바타 (assistant/system 메시지에만) */}
        {avatar && variant !== 'user' && <div className="mr-3 flex-shrink-0">{avatar}</div>}

        <div className="flex flex-col space-y-1">
          {/* 메시지 버블 */}
          <div className={styles.message}>
            {enableMarkdown ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <span className="text-sm leading-relaxed">{content}</span>
            )}
          </div>

          {/* 시간 표시 */}
          {timestamp && (
            <div
              className={`text-xs text-gray-500 ${variant === 'user' ? 'text-right' : 'text-left'}`}
            >
              {formatTime(timestamp)}
            </div>
          )}
        </div>

        {/* 아바타 (user 메시지에만) */}
        {avatar && variant === 'user' && <div className="ml-3 flex-shrink-0">{avatar}</div>}
      </div>

      {/* 액션 버튼 */}
      {actionButton && variant !== 'user' && (
        <div className="flex justify-start pl-12">
          <button
            onClick={actionButton.onClick}
            className={`
              inline-flex items-center space-x-2
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                actionButton.variant === 'primary'
                  ? `bg-[${theme.colors.primary}] hover:bg-[${theme.colors.primaryHover}] text-white shadow-sm hover:shadow-md`
                  : actionButton.variant === 'secondary'
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-transparent hover:bg-gray-50 text-gray-600 border border-gray-300'
              }
            `}
          >
            <span>{actionButton.text}</span>
            {actionButton.icon && <span className="text-current">{actionButton.icon}</span>}
          </button>
        </div>
      )}
    </div>
  )
}
