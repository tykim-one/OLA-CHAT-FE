import Image from 'next/image'


import type { PerformanceRow, RecommendedProducts } from '@/types/report'

import { CompletedReportHeader } from './CompletedReportHeader'
import { Separator } from '../ui/separator'

interface PortfolioRecommendationContainerProps {
  recommended_products: RecommendedProducts
  performance_rows: PerformanceRow[]
  pageNumber: number
}

export const PortfolioRecommendationContainer = ({
  recommended_products,
  performance_rows,
  pageNumber,
}: PortfolioRecommendationContainerProps) => {
  const imageSrc = '/image-5.png'

  const rows = [
    ...(recommended_products?.funds || []).map((fund) => ({ ...fund })),
    ...(recommended_products?.etfs || []).map((etf) => ({ ...etf })),
  ]

  return (
    <div className="bg-white relative mb-[50px] px-[38px] pb-[44px] pt-[24px] flex flex-col gap-3 border border-grayscale-b100 max-w-[992px] max-h-[700px] w-full h-full justify-self-center">
      <CompletedReportHeader title="시황 관련 상품" imageSrc={imageSrc} />
      <Separator className="h-[1px] bg-slate-200" />

      <div className="max-h-[275px] h-full space-y-3 mb-7 z-10">
        <h2 className="self-stretch justify-center text-slate-900 text-xl font-semibold leading-7">
          시황 관련 상품
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-b border-slate-200 text-sm font-normal" role="table">
            <thead>
              <tr>
                <th className="bg-slate-100 px-4 py-2 font-semibold w-[122px]" scope="col">
                  구분
                </th>
                <th className="bg-slate-100 px-4 py-2 font-semibold w-[379px]" scope="col">
                  추천 펀드/ETF
                </th>
                <th className="bg-slate-100 px-4 py-2 font-semibold" scope="col">
                  핵심 투자 포인트
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.name}>
                  <td className="border-b border-slate-200 px-4 py-2 text-center">{row.type}</td>
                  <td className="border-b border-slate-200 px-4 py-2 text-center">{row.name}</td>
                  <td className="border-b border-slate-200 px-4 py-2 text-center">
                    {row.investment_point}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 max-h-[275px] h-full">
        <h2 className="text-slate-900 text-xl font-semibold leading-7">시황 관련 상품 성과</h2>
        <div className="overflow-x-auto">
          <table
            className="min-w-full border-separate border-spacing-0 text-sm font-normal"
            role="table"
          >
            <thead>
              <tr>
                <th
                  className="bg-slate-100 text-neutral-700 px-4 py-3 font-semibold text-center"
                  scope="col"
                >
                  펀드/ETF명
                </th>
                <th
                  className="bg-slate-100 text-neutral-700 px-4 py-3 font-semibold text-center"
                  scope="col"
                >
                  현재 기준가
                </th>
                <th
                  className="bg-slate-100 text-neutral-700 px-4 py-3 font-semibold text-center"
                  scope="col"
                >
                  3개월 수익률
                </th>
                <th
                  className="bg-slate-100 text-neutral-700 px-4 py-3 font-semibold text-center"
                  scope="col"
                >
                  6개월 수익률
                </th>
                <th
                  className="bg-slate-100 text-neutral-700 px-4 py-3 font-semibold text-center"
                  scope="col"
                >
                  1년 수익률
                </th>
                <th
                  className="bg-slate-100 text-neutral-700 px-4 py-3 font-semibold text-center"
                  scope="col"
                >
                  2년 수익률
                </th>
              </tr>
            </thead>
            <tbody>
              {performance_rows.map((row) => (
                <tr key={row.name} className="bg-white text-black">
                  <td className="border-b border-slate-200 px-4 py-3 text-center">{row.name}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-center">{row.price}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-center">
                    {row.return3m}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 text-center">
                    {row.return6m}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 text-center">
                    {row.return1y}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 text-center">
                    {row.return2y}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="absolute bottom-5 right-9 text-xs text-slate-700 font-normal">
        {String(pageNumber).padStart(2, '0')}
      </div>

      <Image
        src="/finish.png"
        alt="finish"
        width={400}
        height={100}
        priority
        className="absolute bottom-0 right-0 object-contain opacity-50 pointer-events-none select-none z-10"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 100% 100%, rgba(0, 152, 217, 0.3) 0%, rgba(0, 79, 157, 0) 100%)',
        }}
      />
    </div>
  )
}
