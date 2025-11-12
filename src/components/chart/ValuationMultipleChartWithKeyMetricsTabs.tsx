'use client'

import { useState, useMemo } from 'react'
import { RenderChartModel } from '@/types/editor/chart'
import { DataSetField } from '@/types/dataset'
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

type ValuationMetricsTab = Extract<DataSetField, 'peRatio' | 'pbRatio'>

interface ValuationMetricsTabConfig {
  id: ValuationMetricsTab
  label: string
}

const tabs: ValuationMetricsTabConfig[] = [
  { id: 'peRatio', label: 'PER' },
  { id: 'pbRatio', label: 'PBR' },
]

interface ValuationMultipleChartWithKeyMetricsTabsProps {
  payload: RenderChartModel
}

export default function ValuationMultipleChartWithKeyMetricsTabs({ payload }: ValuationMultipleChartWithKeyMetricsTabsProps) {
  const [activeTab, setActiveTab] = useState<ValuationMetricsTab>('peRatio')

  const modifiedPayload = useMemo(() => {
    const selectedTab = tabs.find(tab => tab.id === activeTab)
    if (!selectedTab) return payload

    const newPayload: RenderChartModel = {
      ...payload,
      meta: {
        ...payload.meta,
        options: {
          ...payload.meta.options,
          'VALUATION_METRIC': {
            value: selectedTab.id,
          }
        }
      },
    }

    return newPayload
  }, [payload, activeTab])

  return (
    <div className="w-full">
      {/* 타임프레임 메뉴바 */}
      <div className="mb-4">
        <Menubar  className="w-fit border-slate-300">
          {tabs.map((tab) => (
            <MenubarMenu 
              key={tab.id}
            >
              <MenubarTrigger 
                onClick={() => setActiveTab(tab.id)}
                className={cn('h-[32px] justify-center data-[state=open]:bg-slate-100',activeTab === tab.id ? 'bg-slate-100' : '')}
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
