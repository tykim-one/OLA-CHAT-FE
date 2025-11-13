'use client'

import React from 'react'
import { HandCoins } from 'lucide-react'
import { MarketIndex } from '@/types/dailySummary'
import MarketIndexTable from './MarketIndexTable'

interface CommodityPricesSectionProps {
  commodityPrices: MarketIndex[]
}

const CommodityPricesSection: React.FC<CommodityPricesSectionProps> = ({ commodityPrices }) => {
  return (
    <div className="flex flex-col items-center gap-2 px-5">
      {/* Midheader */}
      <div className="flex items-center justify-start gap-2.5 w-full">
        <HandCoins className="w-8 h-8 text-teal-500" strokeWidth={1.33} />
        <h2 className="text-2xl font-bold text-black">원자재 가격</h2>
      </div>

      {/* Commodity Prices Table */}
      <div className="flex flex-col items-center gap-1 w-full">
        <MarketIndexTable indices={commodityPrices} theme='commodity'/>
      </div>
    </div>
  )
}

export default CommodityPricesSection




