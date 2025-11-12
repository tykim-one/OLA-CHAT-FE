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

type FinancialMetricsTab = Extract<DataSetField, 'revenue' | 'operatingIncome' | 'netIncome' | 'operatingProfitMargin'>

interface FinancialMetricsTabConfig {
  id: FinancialMetricsTab
  label: string
}

const tabs: FinancialMetricsTabConfig[] = [
  { id: 'revenue', label: '매출' },
  { id: 'operatingIncome', label: '영업이익' },
  { id: 'netIncome', label: '순이익' },
  { id: 'operatingProfitMargin', label: '영업이익률' },
]

interface FinancialChartWithFinancialMetricsTabsProps {
  payload: RenderChartModel
}

export default function FinancialChartWithFinancialMetricsTabs({ payload }: FinancialChartWithFinancialMetricsTabsProps) {
  const [activeTab, setActiveTab] = useState<FinancialMetricsTab>('revenue')

  const modifiedPayload = useMemo(() => {
    const selectedTab = tabs.find(tab => tab.id === activeTab)
    if (!selectedTab) return payload

    const newPayload: RenderChartModel = {
      ...payload,
      meta: {
        ...payload.meta,
        options: {
          ...payload.meta.options,
          'FINANCIAL_METRIC': {
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
