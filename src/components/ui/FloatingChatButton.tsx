'use client'

import Image from 'next/image'
import React from 'react'

/**
 * 확장된 FloatingChatButton 컴포넌트 Props
 */
interface ExtendedFloatingChatButtonProps {
  /** 클릭 이벤트 핸들러 */
  onClick: () => void
  /** 버튼 위치 커스터마이징 */
  position?: {
    bottom?: string
    right?: string
    top?: string
    left?: string
  }
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 버튼 아이콘 커스터마이징 */
  icon?: React.ReactNode
  /** 버튼 색상 테마 */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  /** 커스텀 색상 */
  customColor?: {
    background?: string
    hover?: string
    text?: string
  }
  /** 추가 스타일 클래스 */
  className?: string
  /** 버튼 모양 */
  shape?: 'circle' | 'rounded' | 'square'
  /** 그림자 효과 */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** 애니메이션 효과 */
  animation?: 'none' | 'pulse' | 'bounce' | 'spin' | 'ping'
  /** 접근성 레이블 */
  ariaLabel?: string
  /** 뱃지 표시 */
  badge?: {
    show: boolean
    count?: number
    color?: string
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  }
  /** 툴팁 텍스트 */
  tooltip?: string
  /** 비활성화 상태 */
  disabled?: boolean
}

/**
 * 플로팅 채팅 버튼 컴포넌트
 * 우측 하단에 고정되어 표시되는 채팅 시작 버튼입니다.
 * 확장성을 위해 다양한 커스터마이징 옵션을 제공합니다.
 */
export default function FloatingChatButton({
  onClick,
  position = { bottom: '24px', right: '24px' },
  size = 'md',
  icon,
  variant = 'primary',
  customColor,
  className = '',
  shape = 'circle',
  shadow = 'lg',
  animation = 'none',
  ariaLabel = '채팅 시작하기',
  badge,
  tooltip,
  disabled = false,
}: ExtendedFloatingChatButtonProps) {
  // 크기별 스타일 정의
  const sizeStyles = {
    sm: { padding: 'p-2', iconSize: 16 },
    md: { padding: 'p-3', iconSize: 20 },
    lg: { padding: 'p-4', iconSize: 24 },
    xl: { padding: 'p-5', iconSize: 28 },
  }

  // 색상 테마 정의
  const variantStyles = {
    primary: 'bg-[#059DD6] hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    error: 'bg-red-500 hover:bg-red-600 text-white',
  }

  // 모양별 스타일 정의
  const shapeStyles = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-none',
  }

  // 그림자 효과 정의
  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  }

  // 애니메이션 효과 정의
  const animationStyles = {
    none: '',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    spin: 'animate-spin',
    ping: 'animate-ping',
  }

  // 뱃지 위치 스타일 정의
  const badgePositionStyles = {
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  }

  // 위치 스타일 생성
  const positionStyle = {
    position: 'fixed' as const,
    bottom: position.bottom,
    right: position.right,
    top: position.top,
    left: position.left,
  }

  // 커스텀 색상 스타일 생성
  const customColorStyle = customColor
    ? {
        backgroundColor: customColor.background,
        color: customColor.text,
      }
    : {}

  const customHoverStyle = customColor?.hover
    ? ({
        '--hover-bg': customColor.hover,
      } as React.CSSProperties)
    : {}

  // 최종 클래스 조합
  const buttonClasses = `
    fixed z-40 cursor-pointer transition-all duration-200
    ${customColor ? '' : variantStyles[variant]}
    ${sizeStyles[size].padding}
    ${shapeStyles[shape]}
    ${shadowStyles[shadow]}
    ${animationStyles[animation]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'}
    ${className}
  `.trim()

  // 기본 아이콘
  const defaultIcon = (
    <Image
      src="/chat-bubble.svg"
      alt="chat-bubble"
      width={sizeStyles[size].iconSize}
      height={sizeStyles[size].iconSize}
    />
  )

  return (
    <div className="relative">
      <button
        onClick={disabled ? undefined : onClick}
        className={buttonClasses}
        style={{
          ...positionStyle,
          ...customColorStyle,
          ...customHoverStyle,
          boxShadow:
            variant === 'primary' && !customColor
              ? '0px 20px 20px 0px rgba(5,157,214,0.25)'
              : undefined,
        }}
        aria-label={ariaLabel}
        disabled={disabled}
        title={tooltip}
      >
        {icon || defaultIcon}

        {/* 뱃지 표시 */}
        {badge?.show && (
          <div
            className={`
              absolute flex items-center justify-center
              min-w-[20px] h-5 px-1 rounded-full text-xs font-medium
              ${badge.color || 'bg-red-500 text-white'}
              ${badgePositionStyles[badge.position || 'top-right']}
            `}
          >
            {badge.count !== undefined ? (
              badge.count > 99 ? (
                '99+'
              ) : (
                badge.count
              )
            ) : (
              <div className="w-2 h-2 bg-current rounded-full" />
            )}
          </div>
        )}
      </button>
    </div>
  )
}
