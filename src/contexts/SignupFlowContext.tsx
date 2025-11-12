'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

/**
 * 회원가입 플로우 단계 타입
 */
export type SignupStep = 'email' | 'verify' | 'info' | 'complete'

/**
 * 사용자 추가 정보 타입
 */
export interface UserInfo {
  password: string
  passwordConfirm: string
  company: string
  department: string
  position: string
  name: string
  phone: string
}

/**
 * 회원가입 플로우 상태 타입
 */
interface SignupFlowState {
  // 현재 단계
  currentStep: SignupStep
  
  // 데이터
  email: string
  verificationCode: string
  isEmailVerified: boolean
  userInfo: Partial<UserInfo>
  
  // 메서드
  setEmail: (email: string) => void
  setVerificationCode: (code: string) => void
  setEmailVerified: (verified: boolean) => void
  setUserInfo: (info: Partial<UserInfo>) => void
  goToStep: (step: SignupStep) => void
  goToNextStep: () => void
  goToPrevStep: () => void
  reset: () => void
}

/**
 * 기본 상태
 */
const defaultState: SignupFlowState = {
  currentStep: 'email',
  email: '',
  verificationCode: '',
  isEmailVerified: false,
  userInfo: {},
  setEmail: () => {},
  setVerificationCode: () => {},
  setEmailVerified: () => {},
  setUserInfo: () => {},
  goToStep: () => {},
  goToNextStep: () => {},
  goToPrevStep: () => {},
  reset: () => {},
}

// Context 생성
const SignupFlowContext = createContext<SignupFlowState>(defaultState)

/**
 * 회원가입 플로우 Provider 컴포넌트
 * 
 * 회원가입 과정의 모든 상태를 관리합니다.
 * - Step 1: 이메일 입력
 * - Step 2: 인증코드 검증
 * - Step 3: 추가 정보 입력
 * - Step 4: 완료
 * 
 * @example
 * ```tsx
 * <SignupFlowProvider>
 *   <SignupPage />
 * </SignupFlowProvider>
 * ```
 */
export const SignupFlowProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [currentStep, setCurrentStep] = useState<SignupStep>('email')
  const [email, setEmailState] = useState('')
  const [verificationCode, setVerificationCodeState] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [userInfo, setUserInfoState] = useState<Partial<UserInfo>>({})

  /**
   * 이메일 설정
   */
  const setEmail = useCallback((newEmail: string) => {
    setEmailState(newEmail)
  }, [])

  /**
   * 인증코드 설정
   */
  const setVerificationCode = useCallback((code: string) => {
    setVerificationCodeState(code)
  }, [])

  /**
   * 이메일 인증 상태 설정
   */
  const setEmailVerified = useCallback((verified: boolean) => {
    setIsEmailVerified(verified)
  }, [])

  /**
   * 사용자 추가 정보 설정
   */
  const setUserInfo = useCallback((info: Partial<UserInfo>) => {
    setUserInfoState(prev => ({ ...prev, ...info }))
  }, [])

  /**
   * 특정 단계로 이동
   */
  const goToStep = useCallback((step: SignupStep) => {
    setCurrentStep(step)
  }, [])

  /**
   * 다음 단계로 이동
   */
  const goToNextStep = useCallback(() => {
    const steps: SignupStep[] = ['email', 'verify', 'info', 'complete']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }, [currentStep])

  /**
   * 이전 단계로 이동
   */
  const goToPrevStep = useCallback(() => {
    const steps: SignupStep[] = ['email', 'verify', 'info', 'complete']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }, [currentStep])

  /**
   * 플로우 초기화
   */
  const reset = useCallback(() => {
    setCurrentStep('email')
    setEmailState('')
    setVerificationCodeState('')
    setIsEmailVerified(false)
    setUserInfoState({})
  }, [])

  const value: SignupFlowState = {
    currentStep,
    email,
    verificationCode,
    isEmailVerified,
    userInfo,
    setEmail,
    setVerificationCode,
    setEmailVerified,
    setUserInfo,
    goToStep,
    goToNextStep,
    goToPrevStep,
    reset,
  }

  return (
    <SignupFlowContext.Provider value={value}>
      {children}
    </SignupFlowContext.Provider>
  )
}

/**
 * 회원가입 플로우 Hook
 * 
 * 회원가입 플로우 상태와 메서드에 접근하기 위한 Hook입니다.
 * 
 * @example
 * ```tsx
 * const { currentStep, email, goToNextStep } = useSignupFlow()
 * 
 * // 이메일 설정 후 다음 단계로
 * setEmail('user@example.com')
 * goToNextStep()
 * ```
 */
export const useSignupFlow = () => {
  const context = useContext(SignupFlowContext)
  
  if (!context) {
    throw new Error('useSignupFlow must be used within SignupFlowProvider')
  }
  
  return context
}

