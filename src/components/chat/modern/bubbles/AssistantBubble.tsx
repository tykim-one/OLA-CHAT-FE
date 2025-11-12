'use client'

import { memo, useMemo, useRef, useCallback, useEffect } from 'react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { ModernChatMessage } from '@/types/modern-chat'

interface AssistantBubbleProps {
  message: ModernChatMessage
  className?: string
  onQuestionClick: (question: string) => void
}

// 전역 스크롤 위치 저장소
const globalScrollPositions = new Map<string, number>()

// 테이블 컴포넌트를 컴포넌트 외부로 분리하여 메모이제이션
const TableComponent = memo(({ children, ...props }: any) => {
  const tableRef = useRef<HTMLDivElement>(null)
  const tableId = useRef<string>(`table-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    const tableElement = tableRef.current
    if (tableElement) {
      // 저장된 스크롤 위치 복원
      const savedPosition = globalScrollPositions.get(tableId.current)
      if (savedPosition !== undefined) {
        tableElement.scrollLeft = savedPosition
      }
    }
  }, [])

  const handleScroll = useCallback(() => {
    if (tableRef.current) {
      globalScrollPositions.set(tableId.current, tableRef.current.scrollLeft)
    }
  }, [])

  return (
    <div 
      ref={tableRef}
      className="overflow-x-auto mb-3" 
      onScroll={handleScroll}
      style={{ touchAction: 'auto' }}
    >
      <table className="min-w-full border border-slate-300 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  )
})

TableComponent.displayName = 'TableComponent'

/**
 * AI 어시스턴트 응답 버블 컴포넌트
 * Figma 디자인의 AI 응답 버블을 구현
 */
const AssistantBubble = memo(function AssistantBubble({
  message,
  className = '',
  onQuestionClick,
}: AssistantBubbleProps) {
  if (typeof message.content !== 'string') return null

  // 메시지 전체를 본문으로 처리합니다.
  const content = useMemo(() => message.content as string, [message.content])

  // 최근 동향 포함 여부를 useMemo로 메모이제이션
  const hasRecentTrends = useMemo(() => content.includes('최근 동향'), [content])

  // 마크다운 커스텀 컴포넌트를 useMemo로 메모이제이션
  const markdownComponents = useMemo(() => ({
    h1: ({ children, ...props }: any) => (
      <h1 className="text-xl font-bold text-slate-900 mb-3 mt-4 first:mt-0" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-tableHead text-slate-900 mb-2 mt-3 first:mt-0" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-tableHead text-slate-900 mb-2 mt-3 first:mt-0" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 className="text-tableHead text-slate-900 mb-1 mt-2 first:mt-0" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }: any) => (
      <h5 className="text-tableHead text-slate-900 mb-1 mt-2 first:mt-0" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: any) => (
      <h6 className="text-tableHead text-slate-900 mb-1 mt-2 first:mt-0" {...props}>
        {children}
      </h6>
    ),
    p: ({ children, ...props }: any) => (
      <p className="text-body-medium text-slate-700 leading-6 mb-2 last:mb-0" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul
        className="list-disc list-outside text-body-medium text-slate-700 leading-6 mb-3 space-y-1 ml-4"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol
        className="list-decimal list-outside text-body-medium text-slate-700 leading-6 mb-3 space-y-1 ml-4"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="text-body-medium text-slate-700 leading-6" {...props}>
        {children}
      </li>
    ),
    strong: ({ children, ...props }: any) => (
      <strong className="font-semibold text-slate-900" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: any) => (
      <em className="italic text-slate-800" {...props}>
        {children}
      </em>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote
        className="border-l-4 border-slate-300 pl-4 italic text-slate-600 mb-3"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }: any) => (
      <code
        className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono text-slate-800"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }: any) => (
      <pre className="bg-slate-100 p-3 rounded-lg overflow-x-auto mb-3" {...props}>
        {children}
      </pre>
    ),
    table: TableComponent,
    thead: ({ children, ...props }: any) => (
      <thead className="bg-slate-50" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: any) => (
      <tbody className="divide-y divide-slate-200" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }: any) => (
      <tr className="hover:bg-slate-50" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }: any) => (
      <th
        className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b border-r border-slate-300"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td
        className="px-4 py-3 text-sm text-slate-700 border-b border-r border-slate-200"
        {...props}
      >
        {children}
      </td>
    ),
    // 링크 새창 열기 기능 추가
    a: ({ children, href, ...props }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
        {...props}
      >
        {children}
      </a>
    ),
    hr: (props: any) => <hr className="border-slate-200 my-4" {...props} />,
    del: ({ children, ...props }: any) => (
      <del className="no-underline" {...props}>
        {children}
      </del>
    ),
  }), [])

  return (
    <div className={`flex justify-start px-4 ${className}`}>
      <div className="flex flex-col justify-center items-center w-full gap-1.5 max-w-[100%]">
        {/* 기존 제목 처리 로직 제거 */}
        {/* 섹션 헤더 (예: "최근 동향") */}
        {hasRecentTrends && (
          <div className="w-full">
            <h5 className="text-base font-bold text-slate-900">최근 동향</h5>
          </div>
        )}
        {/* 메인 콘텐츠 */}
        {content && (
          <div className="w-full text-body-medium">
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
        {/* 콘텐츠가 없고 제목만 있는 경우 로직 제거 */}
      </div>
    </div>
  )
})

export default AssistantBubble
