'use client'

import React from 'react'

import { MessageSquare } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { normalizeAnalysisMarkdown } from '@/utils/analysisMarkdown'

interface AiInsightsSectionProps {
  insights: string
}

const AiInsightsSection: React.FC<AiInsightsSectionProps> = ({ insights }) => {
  const normalizedInsights = React.useMemo(() => {
    return normalizeAnalysisMarkdown(insights)
  }, [insights])

  return (
    <div className="flex flex-col items-center gap-2 px-5">
      {/* Midheader */}
      <div className="flex items-center justify-start gap-2.5 w-full">
        <MessageSquare className="w-8 h-8 text-orange-500" strokeWidth={1.33} />
        <h2 className="text-2xl font-bold text-black">주요 요약 및 AI 인사이트</h2>
      </div>

      {/* AI Insights Card */}
      <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm p-4 text-xl">
        {normalizedInsights ? (
          <ReactMarkdown
            components={
              {
                // p: ({ node, ...props }) => (
                //   <p {...props} className="m-0 text-xl font-medium text-slate-900 leading-7" />
                // ),
                // ul: ({ node, ...props }) => (
                //   <ul
                //     {...props}
                //     className="m-0 list-disc list-outside pl-6 text-xl font-medium text-slate-900 leading-7 space-y-2"
                //   />
                // ),
                // li: ({ node, ...props }) => (
                //   <li {...props} className="text-xl font-medium text-slate-900 leading-7" />
                // ),
                // strong: ({ node, ...props }) => (
                //   <strong {...props} className="font-bold text-slate-900" />
                // ),
                // em: ({ node, ...props }) => <em {...props} className="not-italic text-slate-900" />,
                // a: ({ node, ...props }) => (
                //   <a
                //     {...props}
                //     className="text-orange-500 underline underline-offset-4"
                //     target="_blank"
                //     rel="noreferrer"
                //   />
                // ),
              }
            }
          >
            {normalizedInsights}
          </ReactMarkdown>
        ) : (
          <p className="text-base font-medium text-slate-500">데이터를 불러올 수 없습니다.</p>
        )}
      </div>
    </div>
  )
}

export default AiInsightsSection
