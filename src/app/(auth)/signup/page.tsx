'use client'

import React from 'react'
import { SignupFlowProvider, useSignupFlow } from '@/contexts/SignupFlowContext'
import { AuthCard } from '@/components/auth/LoginCard'
import { SignupEmailStep } from '@/components/auth/SignupEmailStep'
import { SignupVerifyStep } from '@/components/auth/SignupVerifyStep'
import { SignupInfoStep } from '@/components/auth/SignupInfoStep'

/**
 * 회원가입 플로우 컨텐츠 컴포넌트
 * 
 * 현재 단계에 따라 적절한 컴포넌트를 렌더링합니다.
 */
const SignupFlowContent: React.FC = () => {
  const { currentStep } = useSignupFlow()

  return (
    <AuthCard
      title="OLA Suite"
      description="금융 채팅과 리포트 자동화를 하나의 작업공간에서"
    >
      {/* Step 1: 이메일 입력 */}
      {currentStep === 'email' && <SignupEmailStep />}
      
      {/* Step 2: 인증코드 검증 */}
      {currentStep === 'verify' && <SignupVerifyStep />}
      
      {/* Step 3: 추가 정보 입력 */}
      {currentStep === 'info' && <SignupInfoStep />}
      
      {/* Step 4: 완료 (로그인 페이지로 리다이렉트) */}
      {currentStep === 'complete' && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="text-2xl">🎉</div>
          <h2 className="text-xl font-bold text-gray-900">
            회원가입이 완료되었습니다!
          </h2>
          <p className="text-gray-600 text-center">
            로그인 페이지로 이동합니다...
          </p>
        </div>
      )}
    </AuthCard>
  )
}

/**
 * 회원가입 페이지 컴포넌트
 * 
 * 회원가입 프로세스를 관리하는 메인 페이지입니다.
 * 
 * 플로우:
 * 1. 이메일 입력 → 인증코드 발송
 * 2. 인증코드 입력 → 이메일 인증
 * 3. 추가 정보 입력 → 회원가입 완료
 * 4. 로그인 페이지로 리다이렉트
 * 
 * @example
 * URL: /signup
 */
const SignupPage: React.FC = () => {
  return (
    <SignupFlowProvider>
      <SignupFlowContent />
    </SignupFlowProvider>
  )
}

export default SignupPage

