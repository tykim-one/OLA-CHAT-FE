'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'

const NoticeSection = () => {
  return (
    <div className="flex flex-col items-center gap-2 px-5">
      {/* Midheader - Red Background */}
      <div className="flex items-center justify-start gap-2.5 w-full px-2 py-2 bg-red-100 rounded-xl">
        <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={1.33} />
        <h2 className="text-2xl font-bold text-red-500">유의 사항</h2>
      </div>

      {/* Notice Card */}
      <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm p-4">
        <div className="text-xl font-medium text-slate-600 leading-7 whitespace-pre-line pl-5">
          <li>
            본 자료는 경제와 금융시장 이해를 돕기 위한 정보 제공 목적의 자체 조사·분석 자료입니다.
          </li>
          <li>본 자료는 AI가 생성한 자료입니다.</li>
          <li>투자 권유가 아니며 투자 판단의 최종 책임은 투자자 본인에게 있습니다.</li>
          <li>
            수집된 정보의 정확성과 완전성은 보장되지 않으며 사전 통지 없이 변경될 수 있습니다.
          </li>
          <li>
            본 자료와 포함된 저작물은 IBK기업은행의 사전 서면 동의 없이 무단 복제, 배포, 전송, 대여 등이
            금지됩니다.
          </li>
        </div>
      </div>
    </div>
  )
}

export default NoticeSection
