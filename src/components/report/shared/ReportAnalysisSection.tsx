import ReactMarkdown from 'react-markdown'

import { ReportSectionTitle } from './ReportSectionTitle'

interface ReportAnalysisSectionProps {
  // 섹션 제목
  title: string
  // 렌더링할 마크다운 문자열
  markdown: string | null
  // 분석 제공 가능 여부 (예: 뉴스 데이터 존재 여부)
  canDisplayAnalysis: boolean
}

// 마크다운 요소에 적용할 공통 스타일과 접근성 속성 정의
const markdownComponents = {
  p: ({ node, ...props }: React.ComponentProps<'p'> & { node?: unknown }) => (
    <p {...props} className="text-xl font-medium leading-7 text-[#334155]" />
  ),
  ul: ({ node, ...props }: React.ComponentProps<'ul'> & { node?: unknown }) => (
    <ul {...props} className="flex flex-col gap-1.5 list-disc pl-6" />
  ),
  li: ({ node, ...props }: React.ComponentProps<'li'> & { node?: unknown }) => (
    <li {...props} className="text-xl font-medium leading-7 text-[#334155]" />
  ),
  strong: ({ node, ...props }: React.ComponentProps<'strong'> & { node?: unknown }) => (
    <strong {...props} className="font-bold text-[#0f172a]" />
  ),
  a: ({ node, ...props }: React.ComponentProps<'a'> & { node?: unknown }) => (
    <a
      {...props}
      className="text-[#2563eb] underline"
      tabIndex={0}
      aria-label={`분석 링크: ${props.href ?? ''}`}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.currentTarget.click()
        }
      }}
    />
  ),
}

export const ReportAnalysisSection = ({ title, markdown, canDisplayAnalysis }: ReportAnalysisSectionProps) => {
  const hasContent = Boolean(markdown)

  const showEmptyState = !hasContent || !canDisplayAnalysis

  return (
    <section className="space-y-4">
      <ReportSectionTitle title={title} />

      {showEmptyState ? (
        <div className="flex min-h-[112px] items-center justify-center rounded bg-slate-50 px-4 py-6">
          <p className="text-xl text-slate-400">발행된 뉴스가 없기에 전망과 분석을 제공하기 어렵습니다.</p>
        </div>
      ) : (
        <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>
      )}
    </section>
  )
}


