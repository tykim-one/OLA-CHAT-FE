'use client'

import Image from 'next/image'

import { WelcomeSectionProps } from '@/types/modern-chat'

/**
 * 채팅 초기 화면의 환영 메시지 섹션
 * Figma 디자인의 "안녕하세요!" 부분을 구현
 */
export default function WelcomeSection({
  title,
  subtitle,
  showIcon = false,
  className = '',
}: WelcomeSectionProps) {
  return (
    <div
      className={`w-full h-[140px] flex flex-col justify-center gap-2 bg-gradient-to-b from-yellow-50 to-indigo-50 rounded-3xl relative mb-4 px-3 py-5 ${className}`}
      style={{
        backgroundImage: 'url(/welcome.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 메인 타이틀 */}
      <div className="flex flex-col gap-4 items-center h-full justify-center">
        <div className="text-base font-bold leading-normal">{title}</div>

        {/* 서브타이틀 */}
        {/* <p className="text-sm font-medium text-slate-900 leading-6 whitespace-pre-line"> */}
        <div className="text-sm font-normal leading-tight whitespace-pre-line">{subtitle}</div>
      </div>
      {/* </p> */}
    </div>
  )
}
