import React from 'react'

import { cn } from '@/lib/utils'

import { ReportPdfDownloadButton } from './ReportPdfDownloadButton'

type ReportPageLayoutProps = {
  /** 공통으로 사용될 헤더 컴포넌트를 전달합니다. */
  header?: React.ReactNode
  /** 각 페이지에서 생성한 PDF 문서를 전달합니다. */
  pdfDocument: React.ReactElement | null
  /** 다운로드될 PDF 파일 이름을 지정합니다. */
  pdfFileName: string
  /** 페이지 내부에 실제 콘텐츠를 렌더링합니다. */
  children: React.ReactNode
  /** 버튼 문구나 아이콘 등을 조정할 수 있도록 합니다. */
  downloadButtonProps?: {
    idleLabel?: string
    loadingLabel?: string
    errorLabel?: string
    icon?: React.ReactNode
    className?: string
  }
  /** 다운로드 버튼 래퍼를 커스터마이징할 수 있습니다. */
  downloadButtonWrapperClassName?: string
  /** 최상위 컨테이너에 Tailwind 클래스를 덧붙입니다. */
  pageClassName?: string
  /** 메인 콘텐츠 래퍼에 Tailwind 클래스를 덧붙입니다. */
  contentClassName?: string
}

export const ReportPageLayout: React.FC<ReportPageLayoutProps> = ({
  header,
  pdfDocument,
  pdfFileName,
  children,
  downloadButtonProps,
  downloadButtonWrapperClassName,
  pageClassName,
  contentClassName,
}) => {
  // PDF 문서가 없다면 레이아웃을 렌더링할 필요가 없습니다.
  if (!pdfDocument) {
    return null
  }

  const {
    idleLabel,
    loadingLabel,
    errorLabel,
    icon,
    className: downloadButtonClassName,
  } = downloadButtonProps ?? {}

  return (
    <div className={cn('relative flex h-full overflow-y-auto flex-col w-full', pageClassName)}>
      {/* 공통 헤더가 존재한다면 여기에서 렌더링합니다. */}
      {header}

      {/* PDF 다운로드 버튼은 페이지 우측 하단에 고정 배치합니다. */}
      <div className={cn('fixed bottom-4 right-10 z-10', downloadButtonWrapperClassName)}>
        <ReportPdfDownloadButton
          document={pdfDocument}
          fileName={pdfFileName}
          idleLabel={idleLabel}
          loadingLabel={loadingLabel}
          errorLabel={errorLabel}
          icon={icon}
          className={downloadButtonClassName}
        />
      </div>

      {/* 스크롤 가능한 메인 콘텐츠 영역을 제공합니다. */}
      <main className={cn('flex-1 overflow-y-auto', contentClassName)}>{children}</main>
    </div>
  )
}
