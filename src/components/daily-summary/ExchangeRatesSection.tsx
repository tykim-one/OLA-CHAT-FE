'use client'

import React from 'react'

import { Percent } from 'lucide-react'

import { MarketIndex } from '@/types/dailySummary'

import MarketIndexTable from './MarketIndexTable'

interface ExchangeRatesSectionProps {
  exchangeRates: MarketIndex[]
}

const ExchangeRatesSection: React.FC<ExchangeRatesSectionProps> = ({ exchangeRates }) => {
  return (
    <div className="flex flex-col items-center gap-2 px-5">
      {/* Midheader */}
      <div className="flex items-center justify-start gap-2.5 w-full">
        <Percent className="w-8 h-8 text-lime-500" strokeWidth={1.33} />
        <h2 className="text-2xl font-bold text-black">환율 동향</h2>
      </div>

      {/* Exchange Rates Table */}
      <div className="flex flex-col items-center gap-1 w-full">
        <MarketIndexTable indices={exchangeRates} />
      </div>
    </div>
  )
}

export default ExchangeRatesSection
