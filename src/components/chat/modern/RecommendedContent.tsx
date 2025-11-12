'use client'

import { RecommendedContentProps } from '@/types/modern-chat'

import QuestionList from './QuestionList'
import TabMenu from './TabMenu'
import PopularStocksToday from './TodayPopularStocks'

/**
 * 추천 콘텐츠 섹션 컴포넌트
 * Figma 디자인의 추천 질문 전체 영역을 구현
 * 아이콘, 제목, 탭 메뉴, 질문 목록을 포함
 */
export default function RecommendedContent({
  title,
  icon,
  tabs,
  questions,
  stocks = [], // stocks prop 추가
  activeTab,
  onTabChange,
  onQuestionClick,
  className = '',
}: RecommendedContentProps & { stocks?: any[] }) {
  // 현재 활성 탭에 해당하는 질문들만 필터링

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* 제목과 아이콘 */}
      <div className="flex items-center gap-1">
        {icon && <div className="w-6 h-6 flex items-center justify-center">{icon}</div>}
        <h3 className="text-tableHead font-bold text-slate-900">{title}</h3>
      </div>

      {/* 추천 콘텐츠 컨테이너 */}
      <div className="bg-slate-50 border border-slate-200 rounded-[10px] p-2">
        {/* 탭 메뉴 */}
        <TabMenu tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} className="mb-2.5" />
        {/* 질문 목록 */}
        {activeTab === 'recommended' || activeTab === 'popular' ? (
          <QuestionList
            questions={questions}
            onQuestionClick={onQuestionClick}
            activeTab={activeTab}
          />
        ) : (
          <PopularStocksToday stocks={stocks} onQuestionClick={onQuestionClick} />
        )}
      </div>
    </div>
  )
}
