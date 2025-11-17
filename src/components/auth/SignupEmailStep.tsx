'use client'

import React, { useState } from 'react'
import { useSignupFlow } from '@/contexts/SignupFlowContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/**
 * Step 1: 이메일 입력 단계 컴포넌트
 * 
 * 사용자로부터 이메일을 입력받고 인증코드를 발송합니다.
 */
export const SignupEmailStep: React.FC = () => {
  const { email, setEmail, goToNextStep } = useSignupFlow()
  const [localEmail, setLocalEmail] = useState(email)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * 이메일 유효성 검증
   */
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * 다음 버튼 클릭 핸들러
   * 인증코드를 이메일로 발송합니다.
   */
  const handleNext = async () => {
    setError('')
    
    if (!localEmail) {
      setError('이메일을 입력해주세요.')
      return
    }
    
    if (!isValidEmail(localEmail)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }
    
    try {
      setIsLoading(true)
      
      // API 연동 - 인증코드 발송
      const { sendVerificationCode } = await import('@/services/auth/api')
      await sendVerificationCode({ email: localEmail })
      
      setEmail(localEmail)
      goToNextStep()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || '인증코드 발송에 실패했습니다. 다시 시도해주세요.'
      setError(errorMessage)
      console.error('Send verification code error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Enter 키 핸들러
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleNext()
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 이메일 입력 필드 */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="email" className="text-sm text-gray-900">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          placeholder="이메일 주소를 입력해주세요."
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-1 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-900 focus:border-gray-900 focus:ring-gray-900"
          aria-label="이메일 입력"
          autoComplete="email"
          autoFocus
        />
        <p className="text-xs text-gray-600">
          인증에 사용할 이메일을 적어주세요.
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div
          className="rounded-lg bg-red-50 p-4 text-Pre-14-R text-red-700"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {/* 다음 버튼 */}
      <Button
        type="button"
        onClick={handleNext}
        disabled={isLoading || !localEmail}
        className={`w-full rounded-lg px-8 py-2 text-Pre-14-B transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
          isLoading || !localEmail
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-900'
        }`}
        aria-label="다음"
      >
        {isLoading ? '발송 중...' : '다음'}
      </Button>

      {/* 로그인 링크 */}
      <div className="flex items-center justify-between w-full text-Pre-14-R">
        <p className="text-sm text-gray-600">
          이미 회원이신가요?
        </p>
        <a
          href="/login"
          className="text-sm font-bold text-gray-900 hover:underline"
        >
          로그인 하기
        </a>
      </div>
    </div>
  )
}

