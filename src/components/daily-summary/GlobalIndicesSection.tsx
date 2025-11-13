'use client'

import React from 'react'
import { BarChart3 } from 'lucide-react'
import { MarketIndex } from '@/types/dailySummary'
import MarketIndexTable from './MarketIndexTable'
import { IncrementalCacheKind } from 'next/dist/server/response-cache'

interface GlobalIndicesSectionProps {
  indices: MarketIndex[]
}

const GlobalIndicesSection: React.FC<GlobalIndicesSectionProps> = ({ indices }) => {

  return (
    <div className="flex flex-col items-center gap-2 px-5">
      {/* Midheader */}
      <div className="flex items-center justify-start gap-2.5 w-full">
        <BarChart3 className="w-8 h-8 text-fuchsia-500" strokeWidth={1.33} />
        <h2 className="text-2xl font-bold text-black">글로벌 지수 및 주요 시장 지표</h2>
      </div>

      {/* Market Index Table */}
      <div className="flex flex-col items-center gap-1 w-full">
        <MarketIndexTable indices={indices} theme='global'/>
      </div>
    </div>
  )
}

export default GlobalIndicesSection




