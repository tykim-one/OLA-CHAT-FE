'use client'

import React from 'react'
import { Newspaper } from 'lucide-react'
import { NewsItem as NewsItemType } from '@/types/dailySummary'
import NewsItem from './NewsItem'

interface NewsSectionProps {
  news: NewsItemType[]
  onLinkClick: (link: string) => void
}

const NewsSection: React.FC<NewsSectionProps> = ({ news, onLinkClick }) => {
  // 뉴스를 2개의 컬럼으로 나누기 (최대 10개, 각 컬럼에 5개씩)
  const firstColumnNews = news.slice(0, 5)
  const secondColumnNews = news.slice(5, 10)

  const renderNewsCard = (newsItems: NewsItemType[]) => (
    <div className="flex flex-col gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm w-full">
      {newsItems.map((newsItem) => (
        <NewsItem key={newsItem.id} news={newsItem} onLinkClick={onLinkClick} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-2 px-5">
      {/* Midheader */}
      <div className="flex items-center justify-start gap-2.5 w-full">
        <Newspaper className="w-8 h-8 text-gray-500" strokeWidth={1.33} />
        <h2 className="text-2xl font-bold text-black">주요 뉴스 10선</h2>
      </div>

      {/* News Cards - 2 columns */}
      <div className="flex gap-2 w-full">
        {/* 첫 번째 컬럼 */}
        {renderNewsCard(firstColumnNews)}
        
        {/* 두 번째 컬럼 */}
        {renderNewsCard(secondColumnNews)}
      </div>
    </div>
  )
}

export default NewsSection




