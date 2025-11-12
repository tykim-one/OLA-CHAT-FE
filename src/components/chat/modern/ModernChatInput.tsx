'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { ModernChatInputProps } from '@/types/modern-chat'

/**
 * 모던 채팅 입력 컴포넌트
 * Figma 디자인의 입력 필드와 전송 버튼을 구현
 */
export default function ModernChatInput({
  value,
  onChange,
  onSend,
  onAbort,
  state = 'default',
  placeholder = 'IBK투자증권 챗봇에게 무엇이든 물어보세요!',
  disabled = false,
  showSendButton = true,
  className = '',
}: ModernChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // textarea 높이 자동 조절 (최대 4줄)
  useEffect(() => {
    if (!inputRef.current) return

    const textarea = inputRef.current
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight || '20', 10)
    const maxLines = 4
    const maxHeight = lineHeight * maxLines

    // 값이 없으면 placeholder만 보여주므로 한 줄로 고정
    if (value.trim().length === 0) {
      textarea.style.height = `${lineHeight}px`
      textarea.style.overflowY = 'hidden'
      return
    }

    // 높이를 auto로 설정 후 scrollHeight 측정
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, maxHeight)
    textarea.style.height = `${newHeight}px`

    // 4줄 초과 시 스크롤 표시, 이하에서는 숨김
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [value])

  // 상태에 따른 포커스 처리
  useEffect(() => {
    if (state === 'focused' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [state])

  const handleSend = useCallback(() => {
    if (state === 'loading') {
      onAbort?.()
      return
    }

    if (value.trim() && !disabled) {
      onSend(value)
    }
  }, [value, state, onSend, onAbort])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={`flex flex-col w-full gap-1.5 ${className}`}>
      {/* 입력 필드 컨테이너 */}
      <div className="flex w-full">
        {/* 포커스 상태일 때의 외부 보더 */}
        <div
          className={`
          flex w-full rounded-md transition-all duration-200
          ${isFocused ? 'border-slate-400' : ''}
        `}
        >
          <div className="relative w-full bg-white border border-slate-300 rounded-md pl-3 py-2">
            {/* 입력 필드 */}
            <div className="flex items-center">
              <textarea
                ref={inputRef}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled || state === 'loading'}
                rows={1}
                className="w-full text-sm font-normal bg-transparent border-none outline-none placeholder-slate-400 resize-none pr-8"
              />
            </div>

            {/* 전송/중지 버튼 */}
            {showSendButton && (
              <button
                onClick={handleSend}
                disabled={!value.trim() && !(disabled || state === 'loading')}
                className={`absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center transition-colors duration-200 bg-transparent
                  ${disabled || state === 'loading' ? 'cursor-pointer' : ''}
                `}
                aria-label={disabled || state === 'loading' ? '요청 중지' : '메시지 전송'}
              >
                {disabled && state === 'loading' ? (
                  // 사각형 중지 아이콘 (클릭 가능)
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="6" y="6" width="8" height="8" rx="1" fill="#6366F1" />
                  </svg>
                ) : state === 'default' ? (
                  // 기존 전송 아이콘
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.05389 2.8961C2.23334 2.71302 2.50608 2.65798 2.74237 2.75743L18.5754 9.42442C18.807 9.52195 18.958 9.74831 18.9582 9.99962C18.9582 10.2511 18.8071 10.4782 18.5754 10.5758L2.74237 17.2428C2.50614 17.3422 2.23332 17.2871 2.05389 17.1041C1.8745 16.921 1.82474 16.6469 1.92889 16.4127L4.50604 10.6246H10.8332C11.1784 10.6246 11.4582 10.3448 11.4582 9.99962C11.458 9.65461 11.1782 9.37462 10.8332 9.37462H4.50604L1.92889 3.58751C1.82465 3.35327 1.87445 3.07924 2.05389 2.8961Z"
                      fill="#E2E8F0"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.05389 2.89622C2.23334 2.71314 2.50608 2.65811 2.74237 2.75755L18.5754 9.42454C18.807 9.52208 18.958 9.74843 18.9582 9.99974C18.9582 10.2512 18.8071 10.4783 18.5754 10.5759L2.74237 17.2429C2.50614 17.3423 2.23332 17.2872 2.05389 17.1042C1.8745 16.9211 1.82474 16.647 1.92889 16.4128L4.50604 10.6247H10.8332C11.1784 10.6247 11.4582 10.3449 11.4582 9.99974C11.458 9.65473 11.1782 9.37474 10.8332 9.37474H4.50604L1.92889 3.58763C1.82465 3.35339 1.87445 3.07936 2.05389 2.89622Z"
                      fill="#6366F1"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
