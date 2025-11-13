'use client'

import React from 'react'

import { SearchCheck } from 'lucide-react'

import { createMarkdownList, parseAnalysisMarkdown } from '@/utils/analysisMarkdown'

interface KeywordsSectionProps {
  keywords: string[]
}

const KeywordsSection: React.FC<KeywordsSectionProps> = ({ keywords }) => {
  const keywordMarkdown = React.useMemo(() => {
    return createMarkdownList(keywords)
  }, [keywords])

  const keywordBlocks = React.useMemo(() => {
    return parseAnalysisMarkdown(keywordMarkdown)
  }, [keywordMarkdown])

  return (
    <div className="flex flex-col items-center gap-2 px-5">
      {/* Midheader */}
      <div className="flex items-center justify-start gap-2.5 w-full">
        <SearchCheck className="w-8 h-8 text-violet-500" strokeWidth={1.33} />
        <h2 className="text-2xl font-bold text-black">오늘의 금융시장 키워드</h2>
      </div>

      {/* Keywords Card */}
      <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm p-4 min-h-[140px] max-h-[200px] overflow-y-hidden">
        {keywordBlocks.length > 0 ? (
          <ul className="space-y-0.5" role="list" aria-label="오늘의 금융시장 키워드 목록">
            {keywordBlocks.map((block, blockIndex) => {
              if (block.type === 'list') {
                return block.items.map((itemSegments, itemIndex) => (
                  <li
                    key={`keyword-list-${blockIndex}-${itemIndex}`}
                    className="flex items-start gap-2"
                    role="listitem"
                    aria-label={`키워드 ${itemIndex + 1}`}
                  >
                    <span className="mt-[6px] text-xl text-slate-900">•</span>
                    <span className="text-xl font-normal text-slate-900 leading-7">
                      {itemSegments.map((segment, segmentIndex) => (
                        <span
                          key={`keyword-list-${blockIndex}-${itemIndex}-segment-${segmentIndex}`}
                          className={segment.isBold ? 'font-semibold text-slate-900' : undefined}
                        >
                          {segment.text}
                        </span>
                      ))}
                    </span>
                  </li>
                ))
              }

              return (
                <li
                  key={`keyword-paragraph-${blockIndex}`}
                  className="text-xl font-normal text-slate-900 leading-7"
                  role="listitem"
                >
                  {block.segments.map((segment, segmentIndex) => (
                    <span
                      key={`keyword-paragraph-${blockIndex}-segment-${segmentIndex}`}
                      className={segment.isBold ? 'font-semibold text-slate-900' : undefined}
                    >
                      {segment.text}
                    </span>
                  ))}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="text-base font-medium text-slate-500">데이터를 불러올 수 없습니다.</div>
        )}
      </div>
    </div>
  )
}

export default KeywordsSection
