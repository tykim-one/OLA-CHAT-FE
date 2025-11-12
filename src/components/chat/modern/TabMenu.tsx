'use client'

import { TabMenuProps } from '@/types/modern-chat'

/**
 * 추천 콘텐츠의 탭 메뉴 컴포넌트
 * Figma 디자인의 "💡 추천 질문", "🔥 실시간 인기 질문" 등의 탭을 구현
 */
export default function TabMenu({ tabs, activeTab, onTabChange, className = '' }: TabMenuProps) {
  return (
    <div
      className={`grid grid-cols-3 bg-white border border-slate-300 rounded-md p-1 px-0 ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
        w-full rounded transition-all duration-200 py-1.5 text-sm cursor-pointer
        ${
          activeTab === tab.id ? 'bg-slate-100 text-black' : 'bg-white text-black hover:bg-slate-50'
        }
      `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
