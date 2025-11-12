'use client'

import React from 'react'

import AutoReportView from '@/components/AutoReportView'
import CreateReportView from '@/components/CreateReportView'
// import Header from '@/components/shared/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useMainPageViewModel } from '@/hooks/main'

export default function MainReportPage() {
  const {
    // 상태
    contentMeta,
    loading,

    // 핸들러
    handleNewReport,
    handleDeleteReport,
    handleReportClick,
  } = useMainPageViewModel()

  return (
    <div className="w-full h-full bg-Grayscale-B50 font-pretendard">
      <div className="w-full h-full px-10 py-2 flex flex-col items-center">
        {/* <BreadCrumb showHome={true} className="mb-2 max-w-[1040px] w-full" /> */}

        <div className="bg-transparent rounded-[20px] max-w-[1040px] w-full overflow-hidden">
          <Tabs defaultValue="auto-report" className="w-full">
            <TabsList className="w-[500px] mx-auto mt-0 bg-white border-gray-200 border-b-0 rounded-t-3xl">
              <TabsTrigger value="create-report" className="w-full">
                수동 리포트 생성
              </TabsTrigger>
              <TabsTrigger value="auto-report" className="w-full">
                자동 리포트 보기
              </TabsTrigger>
            </TabsList>

            <TabsContent value="auto-report" className="p-6 bg-white/80 rounded-xl shadow-[0px_-2px_40px_0px_rgba(223,235,255,0.15)] mt-0 min-h-[272px]" >
              <AutoReportView />
            </TabsContent>

            <TabsContent
              value="create-report"
              className="p-6 border-t border-gray-200 bg-white mt-0 min-h-[798px]"
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
