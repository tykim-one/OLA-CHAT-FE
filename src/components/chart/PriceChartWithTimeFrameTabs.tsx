'use client'

import { useState, useMemo } from 'react'
import { RenderChartModel } from '@/types/editor/chart'
import { ViewChartWithDataSet } from './RenderChart'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarRadioGroup,
  MenubarRadioItem,
} from '@/components/ui/menubar'
import { cn } from '@/lib/utils'

type TimeFrameTab = '1d' | '1w' | '1M' | '1y'

interface TimeFrameTabConfig {
  id: TimeFrameTab
  label: string
  aggregationType: 'day' | 'week' | 'month' | 'year'
}

const TIME_FRAME_TABS: TimeFrameTabConfig[] = [
  { id: '1d', label: '일', aggregationType: 'day' },
  { id: '1w', label: '주', aggregationType: 'week' },
  { id: '1M', label: '월', aggregationType: 'month' },
  { id: '1y', label: '년', aggregationType: 'year' },
]

interface PriceChartWithTimeFrameTabsProps {
  payload: RenderChartModel
}

export default function PriceChartWithTimeFrameTabs({ payload }: PriceChartWithTimeFrameTabsProps) {
  const [activeTab, setActiveTab] = useState<TimeFrameTab>('1d')

  // activeTab에 따라 수정된 payload 생성
  const modifiedPayload = useMemo(() => {
    const selectedTab = TIME_FRAME_TABS.find(tab => tab.id === activeTab)
    if (!selectedTab) return payload

    // payload의 meta에 선택된 timeframe 정보 추가
    const newPayload: RenderChartModel = {
      ...payload,
      meta: {
        ...payload.meta,
        options: {
          ...payload.meta.options,
          'TIME_FRAME': {
            value: selectedTab.aggregationType,
          }
        }
      },
      // aggregationType 정보를 어디에 추가할지는 데이터 구조에 따라 조정 필요
    }

    return newPayload
  }, [payload, activeTab])

  return (
    <div className="w-full">
      {/* 타임프레임 메뉴바 */}
      <div className="mb-4">
        <Menubar  className="w-fit border-slate-300">
          {TIME_FRAME_TABS.map((tab) => (
            <MenubarMenu 
              key={tab.id}
            >
              <MenubarTrigger 
                onClick={() => setActiveTab(tab.id)}
                className={cn('w-[56px] h-[32px] justify-center data-[state=open]:bg-slate-100',activeTab === tab.id ? 'bg-slate-100' : '')}
              >
                {tab.label}
              </MenubarTrigger>
            </MenubarMenu>
          ))}
        </Menubar>
      </div>

      {/* 차트 렌더링 */}
      <ViewChartWithDataSet payload={modifiedPayload} />
    </div>
  )
}
