'use client'

import React from 'react'
import Image from 'next/image'

/**
 * AuthCard Props 타입 정의
 * 
 * @property title - 카드 타이틀 (예: "OLA Suite")
 * @property description - 카드 설명 (예: "금융 채팅과 리포트...")
 * @property children - 폼 콘텐츠 영역 (입력 필드, 버튼 등)
 * @property logoSrc - 상단 로고 이미지 경로 (옵션, 기본값: "/ola.png")
 * @property logoWidth - 로고 너비 (옵션, 기본값: 111)
 * @property logoHeight - 로고 높이 (옵션, 기본값: 40)
 * @property bottomLogoSrc - 하단 로고 이미지 경로 (옵션, 기본값: "/oneline-logo.png")
 * @property showBottomLogo - 하단 로고 표시 여부 (옵션, 기본값: true)
 */
interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  logoSrc?: string
  logoWidth?: number
  logoHeight?: number
  bottomLogoSrc?: string
  showBottomLogo?: boolean
}

/**
 * 인증 카드 컴포넌트
 * 
 * Figma 디자인 시스템을 기반으로 한 재사용 가능한 인증 폼 UI 컴포넌트입니다.
 * 로그인, 회원가입, 비밀번호 재설정 등 다양한 인증 관련 페이지에서 사용할 수 있습니다.
 * 
 * 주요 기능:
 * - 브랜드 로고 및 타이틀 표시
 * - Children을 통한 유연한 폼 콘텐츠 주입
 * - 하단 브랜드 로고 표시 (옵션)
 * - 일관된 디자인 레이아웃 제공
 * 
 * @example
 * ```tsx
 * <AuthCard
 *   title="OLA Suite"
 *   description="금융 채팅과 리포트 자동화를 하나의 작업공간에서"
 * >
 *   <form onSubmit={handleSubmit}>
 *     <input type="email" />
 *     <input type="password" />
 *     <button type="submit">로그인</button>
 *   </form>
 * </AuthCard>
 * ```
 */
export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  children,
  bottomLogoSrc = '/oneline-logo.png',
  showBottomLogo = true,
}) => {
  return (
    <div 
      className="backdrop-blur-[3px] bg-[#ffffff]/90 border border-white rounded-[20px] p-8 flex flex-col gap-6 items-center w-[360px]"
      data-name="Section"
    >
      {/* 상단 - 로고 및 타이틀 */}
      <div className="flex flex-col gap-2 items-center w-full" data-name="top">
        <Image src="/ola-text.png" alt="OLA Text Logo" width={111} height={40}/>
        {/* 타이틀 및 설명 */}
        <div className="flex flex-col items-center" data-name="Title">
          <h1 className="text-base font-bold text-gray-700">
            {title}
          </h1>
          <p className="text-sm text-gray-600 text-center">
            {description}
          </p>
        </div>
      </div>

      {/* 폼 콘텐츠 영역 - children으로 주입 */}
      <div className="flex flex-col gap-6 w-full" data-name="content">
        {children}
      </div>

      {/* 하단 - OneLineAI 로고 */}
      {showBottomLogo && (
        <div className="flex flex-col gap-1 items-center" data-name="bottom">
          <div className="w-[113.219px] h-6 relative" data-name="logo">
            <Image
              src={bottomLogoSrc}
              alt="OneLineAI Logo"
              width={113}
              height={24}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

