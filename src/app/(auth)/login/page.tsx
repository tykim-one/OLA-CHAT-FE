'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthContext'
import { AuthCard } from '@/components/auth/LoginCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/**
 * 로그인 페이지 컴포넌트
 * 
 * 사용자 인증을 처리하는 로그인 페이지입니다.
 * LoginCard 컴포넌트를 사용하여 로그인 UI를 표시하고,
 * 로그인 로직을 관리합니다.
 * 
 * 주요 기능:
 * - 로그인 폼 상태 관리 (이메일, 비밀번호, 에러)
 * - AuthContext를 통한 인증 처리
 * - 로그인 성공 시 메인 페이지로 리다이렉트
 */
const LoginPage = () => {
  // Router 훅 - 로그인 성공 시 페이지 이동을 위해 사용
  const router = useRouter()
  
  // Auth Context에서 login 함수와 로딩 상태를 가져옴
//   const { login, isLoading } = useAuth()
  
  // 폼 상태 관리
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  /**
   * 로그인 폼 제출 핸들러
   * @param e - 폼 이벤트 객체
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // 폼의 기본 제출 동작(페이지 새로고침) 방지
    e.preventDefault()
    
    // 에러 메시지 초기화
    setError('')
    
    // 이메일과 비밀번호 입력값 검증
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }
    
    try {
      // API 연동 - 로그인
      const { signIn } = await import('@/services/auth/api')
      const response = await signIn({ 
        email, 
        password 
      })
      
      // 토큰을 로컬 스토리지에 저장
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token)
        localStorage.setItem('token_type', response.token_type)
      }
      
      console.log('Login success:', response)
      
      // 로그인 성공 시 메인 페이지로 이동
      router.push('/main')
    } catch (err: any) {
      // 로그인 실패 시 에러 메시지 설정
      const errorMessage = err?.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
      setError(errorMessage)
      console.error('Login error:', err)
    }
  }
  
  /**
   * 이메일 입력 변경 핸들러
   * @param e - 입력 이벤트 객체
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // 사용자가 입력을 시작하면 에러 메시지 제거
    if (error) setError('')
  }
  
  /**
   * 비밀번호 입력 변경 핸들러
   * @param e - 입력 이벤트 객체
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    // 사용자가 입력을 시작하면 에러 메시지 제거
    if (error) setError('')
  }
  
  /**
   * Enter 키 입력 핸들러
   * 입력 필드에서 Enter 키를 누르면 폼을 제출합니다.
   * @param e - 키보드 이벤트 객체
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent)
    }
  }
  
  return (
    <div>
      {/* 인증 카드 컴포넌트 */}
      <AuthCard
        title="OLA Suite"
        description="금융 채팅과 리포트 자동화를 하나의 작업공간에서"
      >
        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {/* 이메일 입력 필드 */}
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="email"
              className="text-sm text-gray-900"
            >
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="이메일 주소를 입력해주세요."
              value={email}
              onChange={handleEmailChange}
              onKeyDown={handleKeyDown}
            //   disabled={isLoading}
              className="flex-1 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-900 focus:border-gray-900 focus:ring-gray-900 !h-9"
              aria-label="이메일 입력"
              tabIndex={0}
              autoComplete="email"
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="password"
              className="text-sm text-gray-900"
            >
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
            //   disabled={isLoading}
              className="flex-1 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-900 focus:border-gray-900 focus:ring-gray-900"
              aria-label="비밀번호 입력"
              tabIndex={0}
              autoComplete="current-password"
            />
          </div>

          {/* 에러 메시지 표시 */}
          {error && (
            <div
              className="rounded-lg bg-red-50 p-4 text-Pre-14-R text-red-700"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            disabled={email.length === 0 || password.length === 0}
            className="w-full bg-gray-900 hover:bg-gray-800 !text-white rounded-lg px-8 py-2 text-Pre-14-B transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="로그인"
            tabIndex={0}
          >
            {/* {isLoading ? '로그인 중...' : '로그인'} */}
            로그인
          </Button>
        </form>

        {/* 회원가입 링크 */}
        <div className="flex items-center justify-between w-full text-Pre-14-R">
          <p className="text-sm text-gray-600">
            회원이 아니신가요?
          </p>
          <a
            href="/signup"
            className="text-sm font-bold text-gray-900 hover:underline"
            tabIndex={0}
          >
            회원가입 하기
          </a>
        </div>
      </AuthCard>
    </div>
  )
}

export default LoginPage