'use client'

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // 현재 경로에 따라 활성화할 탭 결정
  // /report로 시작하면 'create-report', 그 외는 'auto-report'
  const activeTab = pathname?.startsWith('/report') ? 'create-report' : 'auto-report'

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    if (value === 'auto-report') {
      // 자동 리포트 보기 탭 클릭 시 main 페이지로 이동
      router.push('/main?tab=auto-report')
    } else if (value === 'create-report') {
      // 수동 리포트 생성 탭 클릭 시 report 페이지로 이동
      router.push('/report')
    }
  }

  return (
    <div className="w-full h-full bg-transparent font-pretendard">
      <div className="w-full h-full py-2 flex flex-col items-center">
        <div className="bg-transparent rounded-[12px] max-w-[1040px] w-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full !p-1 mx-auto mt-0 bg-white border-gray-200 flex items-center rounded-xl bg-slate-200/80">
              <TabsTrigger value="create-report" className="w-full data-[state=active]:bg-white">
                수동 리포트 생성
              </TabsTrigger>
              <TabsTrigger value="auto-report" className="w-full data-[state=active]:bg-white">
                자동 리포트 보기
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="create-report"
              className="bg-transparent rounded-xl shadow-[0px_-2px_40px_0px_rgba(223,235,255,0.15)] mt-0 min-h-[272px]"
            >
              {children}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
