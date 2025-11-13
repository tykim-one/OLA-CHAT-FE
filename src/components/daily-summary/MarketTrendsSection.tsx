'use client'

import React from 'react'

import { TrendingUp } from 'lucide-react'

import { MarketChart } from '@/types/dailySummary'

interface MarketTrendsSectionProps {
  marketTrends: MarketChart[]
}

const MarketTrendsSection: React.FC<MarketTrendsSectionProps> = ({ marketTrends }) => {
  return (
    <div className="flex flex-col items-center gap-2 px-5">
      {/* Midheader */}
      <div className="flex items-center justify-start gap-2.5 w-full">
        <TrendingUp className="w-8 h-8 text-yellow-500" strokeWidth={1.33} />
        <h2 className="text-2xl font-bold text-black">시장 추세 그래프</h2>
      </div>

      {/* Market Charts */}
      <div className="flex gap-2 w-full">
        {marketTrends.map((chart, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex-1"
          >
            {/* Chart Title */}
            <div className="flex gap-1.5 w-full">
              <span className="text-xl font-normal text-[#334155]">{chart.date} 일간장중 </span>
              <span className="text-xl font-bold text-[#0F172A]">{chart.title}</span>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-slate-200"></div>

            {/* Chart Image Placeholder */}
            <div className="w-[304.5px] h-[160px] bg-gray-200 rounded flex items-center justify-center">
              {chart.imageUrl ? (
                <img
                  src={chart.imageUrl}
                  alt={`${chart.title} 차트`}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-gray-500 font-medium">{chart.title} 차트</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketTrendsSection
