import React from 'react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/Button'

type ReportStatusTone = 'info' | 'error'

type ReportStatusMessageProps = {
  title: string
  description?: string
  tone?: ReportStatusTone
  actionLabel?: string
  onAction?: () => void
  isPerformingAction?: boolean
}

const toneConfig: Record<ReportStatusTone, { container: string; title: string; description: string }> = {
  info: {
    container: 'border border-blue-100 bg-blue-50 text-blue-900',
    title: 'text-blue-900',
    description: 'text-blue-800',
  },
  error: {
    container: 'border border-red-200 bg-red-50 text-red-900',
    title: 'text-red-900',
    description: 'text-red-800',
  },
}

/**
 * 공통 상태 메시지 컴포넌트는 로딩, 오류, 빈 상태 등 반복되는 UI를 일관되게 표시합니다.
 */
export const ReportStatusMessage: React.FC<ReportStatusMessageProps> = ({
  title,
  description,
  tone = 'info',
  actionLabel,
  onAction,
  isPerformingAction,
}) => {
  const { container, title: titleClassName, description: descriptionClassName } = toneConfig[tone]

  return (
    <section
      className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10 transition-colors duration-200"
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
    >
      <div
        className={cn(
          'flex w-full max-w-md flex-col items-center rounded-xl p-8 text-center shadow-sm',
          container,
        )}
      >
        <h2 className={cn('mb-3 text-lg font-semibold', titleClassName)}>{title}</h2>
        {description ? (
          <p className={cn('mb-6 text-sm leading-6', descriptionClassName)}>{description}</p>
        ) : null}
        {actionLabel && onAction ? (
          <Button
            variant="outline"
            size="sm"
            className="px-5"
            onClick={onAction}
            disabled={isPerformingAction}
            aria-label={actionLabel}
            tabIndex={0}
          >
            {isPerformingAction ? '처리 중...' : actionLabel}
          </Button>
        ) : null}
      </div>
    </section>
  )
}


