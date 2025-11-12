'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { Download, MessageCircle, MessageCircleHeartIcon } from 'lucide-react'

import { useAuth } from '@/providers/AuthContext'

/**
 * Header 컴포넌트
 * 
 * @description
 * 애플리케이션의 전역 헤더 컴포넌트입니다.
 * - 상단: 로고, 사용자 이름, 로그아웃 버튼
 * - 중간: OLA Suite 소개 배너 및 CTA 버튼
 * - 하단: 탭 네비게이션 (금융 챗봇, 보고서 자동화)
 * 
 * @example
 * ```tsx
 * <Header />
 * ```
 */
const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
//   const { user, logout } = useAuth()

  // 로그아웃 버튼 클릭 핸들러
  const handleLogout = () => {
    // logout()
    router.push('/login')
  }

  // 탭 클릭 핸들러
  const handleTabClick = (path: string) => {
    router.push(path)
  }

  // 현재 활성 탭 확인
  const isActiveTab = (path: string) => {
    return pathname?.includes(path)
  }

  return (
    <div className="flex flex-col items-start w-full">
      {/* 상단 헤더 - 로고, 사용자 정보, 로그아웃 */}
      <div className="bg-white border-b border-gray-100 w-full">
        <div className="flex items-center justify-between p-3 w-full">
          {/* 로고 */}
          <div className="relative h-6 w-[113.219px] shrink-0">
            <Image
              src="/oneline-logo.png"
              alt="OneLineAI Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* 사용자 정보 & 로그아웃 버튼 */}
          <div className="flex items-center gap-3 shrink-0">
            <p className="text-sm font-bold text-gray-900 leading-6">
              {/* {user?.name || '사용자'}님 */}
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 leading-5 hover:bg-gray-50 transition-colors"
              aria-label="로그아웃"
            >
              로그아웃
            </button>
          </div>
        </div>
        {/* 상단 헤더 내부 그림자 효과 */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0.5px_0px_0px_rgba(255,255,255,0.5)]" />
      </div>

      {/* 중간 배너 - OLA Suite 소개 */}
      <div className="relative bg-blue-600/80 w-full px-3 py-2 flex flex-col items-center justify-center gap-1 shadow-[0px_-2px_10px_0px_rgba(223,235,255,0.3),0px_-2px_40px_0px_rgba(223,235,255,0.15)]">
        {/* 배너 텍스트 */}
        <p className="text-sm font-bold text-white leading-5">
          <span className="font-medium">레고처럼 조립하는 간편한 금융 AI 서비스 </span>
          <span>OLA Suite</span>
        </p>

        {/* CTA 버튼들 */}
        <div className="flex items-center justify-center gap-2 shrink-0">
          {/* 데모 신청하기 버튼 */}
          <button
            onClick={() => {
              // 데모 신청 기능 추가 가능
              console.log('데모 신청하기 클릭')
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg w-[120px] hover:bg-gray-50 transition-colors"
            aria-label="데모 신청하기"
          >
            <MessageCircleHeartIcon className="w-4 h-4 text-gray-900" />
            <span className="text-xs font-medium text-gray-900 leading-4">
              데모 신청하기
            </span>
          </button>

          {/* 서비스 소개서 버튼 */}
          <button
            onClick={() => {
              // 서비스 소개서 다운로드 기능 추가 가능
              console.log('서비스 소개서 클릭')
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg w-[120px] hover:bg-gray-50 transition-colors"
            aria-label="서비스 소개서 다운로드"
          >
            <Download className="w-4 h-4 text-gray-900" />
            <span className="text-xs font-medium text-gray-900 leading-4">
              서비스 소개서
            </span>
          </button>
        </div>

        {/* 배너 내부 그림자 효과 */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0.5px_0px_0px_rgba(255,255,255,0.5)]" />
      </div>

      {/* 하단 탭 네비게이션 */}
      <div className="relative bg-white border-b border-blue-100 w-full">
        <div className="flex items-center justify-center px-3 py-0 w-full">
          {/* 탭 목록 */}
          <div className="flex items-center justify-center gap-1 border-b border-gray-200">
            {/* 금융 챗봇 탭 */}
            <button
              onClick={() => handleTabClick('/chat?auth=ola-ola')}
              className={`flex items-center justify-center gap-2.5 px-3 py-2 border-b ${
                isActiveTab('/chat')
                  ? 'border-b-2 border-blue-500'
                  : 'border-gray-200'
              } transition-colors`}
              aria-label="금융 챗봇"
            >
              <span className="text-sm font-medium text-gray-900 leading-5">
                금융 챗봇
              </span>
            </button>

            {/* 보고서 자동화 탭 */}
            <button
              onClick={() => handleTabClick('/main')}
              className={`flex items-center justify-center gap-2.5 px-3 py-2 border-b ${
                isActiveTab('/main')
                  ? 'border-b-2 border-blue-500'
                  : 'border-gray-200'
              } transition-colors`}
              aria-label="보고서 자동화"
            >
              <span className="text-sm font-medium text-gray-900 leading-5">
                보고서 자동화
              </span>
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 내부 그림자 효과 */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0.5px_0px_0px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  )
}

export default Header

