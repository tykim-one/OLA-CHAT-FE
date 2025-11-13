'use client'

import React from 'react'

import { MarketIndex } from '@/types/dailySummary'

interface MarketIndexTableProps {
  indices: MarketIndex[]
  theme?: string
}

const MarketIndexTable: React.FC<MarketIndexTableProps> = ({ indices, theme }) => {
  const getTrendClassName = (trend?: boolean) => {
    if (trend === undefined) {
      return 'text-slate-700'
    }

    return trend ? 'text-[#EF4444]' : 'text-[#3B82F6]'
  }

  return (
    <div className="flex flex-col gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm w-full">
      {/* Table Header */}
      <div className="flex gap-2 w-full">
        <div className="flex-1">
          <span className="text-lg font-semibold text-slate-900 text-center block">지수</span>
        </div>
        <div className="flex-1">
          <span className="text-lg font-semibold text-slate-900 text-center block">
            {theme === 'global' ? '종가' : theme === 'commodity' ? '종가(USD)' : '종가(원)'}
          </span>
        </div>
        <div className="flex-[2] flex items-center justify-center">
          <span className="text-lg font-semibold text-slate-900 text-center">전일 대비</span>
          {theme === 'FOREX' && (
            <span className="text-xs text-neutral-700 text-center block">'(%, 원)'</span>
          )}
        </div>
      </div>

      {/* Table Rows */}
      {indices.map((index, idx) => (
        <div key={idx} className="flex gap-2 w-full">
          <div className="flex-1">
            <span className="text-xl font-bold text-slate-900 text-center block">{index.name}</span>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold text-slate-900 text-center block">
              {/* 종가 + 단위 표기 */}
              <span className="inline-flex items-center justify-center gap-1 text-slate-900">
                <span aria-label={`종가 ${index.value}`}>{index.value}</span>
              </span>
            </span>
          </div>
          <div className="flex-[2] flex items-center justify-center gap-3">
            {/* 전일 대비 퍼센트 */}
            <div
              className={`w-full flex justify-center text-xl font-bold text-center items-center gap-1 ${getTrendClassName(index.isPositive)}`}
            >
              <span aria-label={`전일 대비 ${index.change}`}>{index.change}</span>
            </div>
            {/* 전일 대비 절대값 */}
            {index.changeValue ? (
              <div
                className={`text-xl w-full flex justify-center font-semibold text-center items-center gap-1 ${getTrendClassName(index.changeValueIsPositive)}`}
              >
                <span aria-label={`전일 대비 절대값 ${index.changeValue}`}>
                  {index.changeValue}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MarketIndexTable
