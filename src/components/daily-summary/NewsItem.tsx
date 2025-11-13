'use client'

import React, { useMemo } from 'react'

import { decodeHtmlEntities } from '@/utils/htmlDecoder'

import { NewsItem as NewsItemType } from '@/types/dailySummary'

interface NewsItemProps {
  news: NewsItemType
  onLinkClick: (link: string) => void
}

const NewsItem: React.FC<NewsItemProps> = ({ news, onLinkClick }) => {
  const handleLinkClick = () => {
    onLinkClick(news.link)
  }

  const decodedTitle = useMemo(() => decodeHtmlEntities(news.title), [news.title])

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* 제목 */}
      <h3 className="text-lg font-bold text-[#0F172A] leading-6 line-clamp-2">{decodedTitle}</h3>

      {/* 뉴스사와 링크 */}
      <div className="flex items-center gap-2 h-6">
        <span className="text-lg font-medium text-[#0F172A] leading-6">{news.source}</span>
        <button
          onClick={handleLinkClick}
          className="text-base font-semibold text-[#0EA5E9] hover:text-[#0EA5E9] transition-colors cursor-pointer underline leading-6"
        >
          링크
        </button>
      </div>
    </div>
  )
}
export default NewsItem
