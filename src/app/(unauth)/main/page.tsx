'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import AutoReportView from '@/components/AutoReportView'
import CreateReportView from '@/components/CreateReportView'
// import Header from '@/components/shared/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useMainPageViewModel } from '@/hooks/main'

export default function MainReportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URL 쿼리 파라미터에서 탭 값 가져오기
  const tabFromUrl = searchParams?.get('tab')
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'auto-report')

  const {
    // 상태
    contentMeta,
    loading,

    // 핸들러
    handleNewReport,
    handleDeleteReport,
    handleReportClick,
  } = useMainPageViewModel()

  // URL 쿼리 파라미터가 변경되면 탭도 변경
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    if (value === 'create-report') {
      // 수동 리포트 생성 탭 클릭 시 report 페이지로 이동
      router.push('/report')
    } else {
      setActiveTab(value)
    }
  }

  return (
    <div className="w-full h-full bg-transparent font-pretendard">
      <div className="w-full h-full py-2 flex flex-col items-center">
        {/* <BreadCrumb showHome={true} className="mb-2 max-w-[1040px] w-full" /> */}

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

            <TabsContent value="auto-report" className="py-3 bg-white/80 rounded-xl shadow-[0px_-2px_40px_0px_rgba(223,235,255,0.15)] mt-0 min-h-[272px]" >
              <AutoReportView />
            </TabsContent>

            <TabsContent
              value="create-report"
              className="p-6 border-t border-gray-200 bg-white mt-0 h-full"
            >
              <CreateReportView
                contentMeta={contentMeta}
                loading={loading}
                onNewReport={handleNewReport}
                onDeleteReport={handleDeleteReport}
                onReportClick={handleReportClick}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
