'use client'

import { PropsWithChildren } from 'react'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface ChartInfoCardProps {
  id: string
  title: string
  className?: string
  isOpen?: boolean // 추가: 외부에서 제어할 수 있는 열림 상태
  type?: string
}

/**
 * 차트 정보 카드 컴포넌트
 * 채팅 응답에서 차트 정보를 표시
 */
export default function ChartInfoCard({
  id,
  title,
  children,
  className = '',
  type = 'default',
  isOpen, // 추가된 prop
}: PropsWithChildren<ChartInfoCardProps>) {
  return (
    <AccordionItem value={id} className="border-none">
      <div className="w-full">
        <div
          className={`bg-white rounded-[10px] border border-slate-100 p-3 w-full h-fit  ${className} `}
        >
          <AccordionTrigger className="p-0 !items-center">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </AccordionTrigger>
          <AccordionContent asChild className="p-0">
            <div className="space-y-4 w-full mt-2">
              <pre className="text-sm text-slate-600 w-full">{children}</pre>
            </div>
          </AccordionContent>
        </div>
      </div>
    </AccordionItem>
  )
}
