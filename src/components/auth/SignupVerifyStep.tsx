'use client'

import React, { useState, useEffect } from 'react'
import { useSignupFlow } from '@/contexts/SignupFlowContext'
import { VerificationCodeInput } from './VerificationCodeInput'
import { Button } from '@/components/ui/button'

/**
 * Step 2: 인증코드 검증 단계 컴포넌트
 * 
 * 이메일로 발송된 6자리 인증코드를 입력받아 검증합니다.
 */
export const SignupVerifyStep: React.FC = () => {
  const { email, verificationCode, setVerificationCode, setEmailVerified, goToNextStep } = useSignupFlow()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [canResend, setCanResend] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)

  /**
   * 재전송 타이머
   */
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  /**
   * 인증코드 검증
   */
  const handleVerify = async () => {
    setError('')
    
    if (verificationCode.length !== 6) {
      setError('6자리 인증코드를 입력해주세요.')
      return
    }
    
    try {
      setIsLoading(true)
      
      // TODO: API 연동 - 인증코드 검증
      // const result = await verifyCode(email, verificationCode)
      
      // 임시: 1초 대기 후 검증 성공
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEmailVerified(true)
      goToNextStep()
    } catch (err) {
      setError('인증코드가 올바르지 않습니다. 다시 확인해주세요.')
      console.error('Verify code error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 인증코드 재전송
   */
  const handleResend = async () => {
    if (!canResend) return
    
    try {
      setIsLoading(true)
      setError('')
      
      // TODO: API 연동 - 인증코드 재전송
      // await sendVerificationCode(email)
      
      // 임시: 1초 대기
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCanResend(false)
      setResendTimer(60)
      setVerificationCode('')
    } catch (err) {
      setError('인증코드 재전송에 실패했습니다.')
      console.error('Resend code error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 인증코드 완성 시 자동 검증
   */
  const handleCodeComplete = (code: string) => {
    setVerificationCode(code)
    // 6자리 완성되면 자동 검증 (선택사항)
    // handleVerify()
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 이메일 표시 */}
      {/* <div className="flex flex-col gap-2 w-full">
        <label className="text-Pre-14-B text-gray-900">
          이메일
        </label>
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-700">
          {email}
        </div>
        <p className="text-xs text-gray-600">
          인증에 사용할 이메일을 적어주세요.
        </p>
      </div> */}

      {/* 인증코드 입력 */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm text-gray-900">
          인증코드
        </label>
        <VerificationCodeInput
          value={verificationCode}
          onChange={setVerificationCode}
          onComplete={handleCodeComplete}
          disabled={isLoading}
        />
        <p className="text-sm text-gray-600 text-center my-6">
          이메일로 발송한 인증코드를 입력해주세요.
        </p>
        
        {/* 인증코드 재전송 */}
        <div className="flex items-center justify-center text-sm w-full gap-4">
          <span className="text-gray-500">
            인증코드를 받지 못하셨나요?
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className="font-bold text-black hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {canResend ? '인증코드 재전송' : `재전송 (${resendTimer}초)`}
          </button>
        </div>
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
        onClick={handleVerify}
        disabled={isLoading || verificationCode.length !== 6}
        className={`w-full rounded-lg px-8 py-2 text-Pre-14-B transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
          isLoading || verificationCode.length !== 6
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-900'
        }`}
        aria-label="다음"
      >
        {isLoading ? '확인 중...' : '다음'}
      </Button>

      {/* 로그인 링크 */}
      <div className="flex items-center justify-between w-full text-Pre-14-R">
        <p className="text-sm text-gray-500">
          이미 회원이신가요?
        </p>
        <a
          href="/login"
          className="text-sm font-bold text-black hover:underline"
        >
          로그인 하기
        </a>
      </div>
    </div>
  )
}

