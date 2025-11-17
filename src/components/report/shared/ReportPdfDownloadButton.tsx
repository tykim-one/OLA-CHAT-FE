import React from 'react'

import { PDFDownloadLink } from '@react-pdf/renderer'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

type ReportPdfDownloadButtonProps = {
  document: React.ReactElement
  fileName: string
  idleLabel?: string
  loadingLabel?: string
  errorLabel?: string
  className?: string
  icon?: React.ReactNode
  onErrorClick?: () => void
}

const defaultErrorHandler = () => {
  alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
}

export const ReportPdfDownloadButton: React.FC<ReportPdfDownloadButtonProps> = ({
  document,
  fileName,
  idleLabel = 'PDF 다운로드',
  loadingLabel = 'PDF 생성 중...',
  errorLabel = 'PDF 생성 오류',
  className,
  icon,
  onErrorClick,
}) => {
  const handleErrorClick = React.useCallback(() => {
    if (onErrorClick) {
      onErrorClick()
      return
    }

    defaultErrorHandler()
  }, [onErrorClick])

  return (
    <PDFDownloadLink document={document as React.ReactElement<any>} fileName={fileName}>
      {({ loading, error }) => {
        if (error) {
          console.error('PDF 생성 오류:', error)

          return (
            <Button
              variant="outline"
              size="sm"
              className={cn('gap-2', className)}
              onClick={handleErrorClick}
              aria-label={errorLabel}
            >
              {icon}
              {errorLabel}
            </Button>
          )
        }

        return (
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-2 bg-white text-black border border-gray-300 hover:bg-gray-200 px-3 py-2', className)}
            disabled={loading}
            aria-live="polite"
          >
            {icon}
            {loading ? loadingLabel : idleLabel}
          </Button>
        )
      }}
    </PDFDownloadLink>
  )
}
