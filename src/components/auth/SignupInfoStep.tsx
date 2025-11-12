'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignupFlow } from '@/contexts/SignupFlowContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/**
 * Step 3: 추가 정보 입력 단계 컴포넌트
 * 
 * 이메일 인증 완료 후 사용자의 추가 정보를 입력받습니다.
 * - 이메일 (자동 입력, readonly)
 * - 비밀번호
 * - 비밀번호 확인
 * - 회사
 * - 부서
 * - 직급
 * - 이름
 * - 전화번호
 */
export const SignupInfoStep: React.FC = () => {
  const router = useRouter()
  const { email, userInfo, setUserInfo } = useSignupFlow()
  
  const [formData, setFormData] = useState({
    password: userInfo.password || '',
    passwordConfirm: userInfo.passwordConfirm || '',
    company: userInfo.company || '',
    department: userInfo.department || '',
    position: userInfo.position || '',
    name: userInfo.name || '',
    phone: userInfo.phone || '',
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  /**
   * 비밀번호 유효성 검증
   * 영문 대소문자와 특수문자 또한 최소 8자 이상
   */
  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8
    
    return hasLetter && hasSpecialChar && isLongEnough
  }

  /**
   * 입력 변경 핸들러
   */
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    
    // 비밀번호 실시간 검증
    if (field === 'password') {
      if (value && !validatePassword(value)) {
        setPasswordError('영문 대소문자와 특수문자 또한 최소 8자 이상')
      } else {
        setPasswordError('')
      }
    }
  }

  /**
   * 폼 검증
   */
  const validateForm = (): boolean => {
    if (!formData.password || !formData.passwordConfirm || !formData.company || 
        !formData.department || !formData.position || !formData.name || !formData.phone) {
      setError('모든 필드를 입력해주세요.')
      return false
    }
    
    if (!validatePassword(formData.password)) {
      setError('비밀번호는 영문 대소문자와 특수문자를 포함하여 최소 8자 이상이어야 합니다.')
      return false
    }
    
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return false
    }
    
    return true
  }

  /**
   * 회원가입 완료 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setIsLoading(true)
      
      // TODO: API 연동 - 회원가입 완료
      const signupData = {
        email,
        password: formData.password,
        company: formData.company,
        department: formData.department,
        position: formData.position,
        name: formData.name,
        phone: formData.phone,
      }
      
      // await signup(signupData)
      console.log('Signup data:', signupData)
      
      // 임시: 2초 대기
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setUserInfo(formData)
      
      // 회원가입 완료 후 로그인 페이지로 이동
      router.push('/login')
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
      console.error('Signup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 모든 필드가 입력되었는지 확인
   */
  const isFormComplete = Object.values(formData).every(value => value.trim() !== '')

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* 이메일 (readonly) */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-Pre-14-B text-gray-900">
          이메일
        </label>
        <Input
          type="email"
          value={email}
          readOnly
          disabled
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-500 cursor-not-allowed"
        />
      </div>

      {/* 비밀번호 */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="password" className="text-sm text-gray-900">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          disabled={isLoading}
          className="flex-1 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-900 focus:border-gray-900 focus:ring-gray-900"
          autoComplete="new-password"
        />
        {passwordError && (
          <p className="text-xs text-gray-600">{passwordError}</p>
        )}
        {/* {!passwordError && formData.password && ( */}
          <p className="text-xs text-gray-600">영문 대소문자와 특수문자 또한 최소 8자 이상</p>
        {/* )} */}
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="passwordConfirm" className="text-sm text-gray-900">
          비밀번호 확인
        </label>
        <Input
          id="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요."
          value={formData.passwordConfirm}
          onChange={(e) => handleChange('passwordConfirm', e.target.value)}
          disabled={isLoading}
          className="flex-1 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-900 focus:border-gray-900 focus:ring-gray-900"
          autoComplete="new-password"
        />
      </div>

      {/* 회사 */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="company" className="text-sm text-gray-900">
          회사
        </label>
        <Input
          id="company"
          type="text"
          placeholder="회사명을 입력해주세요."
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          disabled={isLoading}
          className="flex-1 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-900 focus:border-gray-900 focus:ring-gray-900"
          autoComplete="organization"
        />
      </div>

      {/* 부서 */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="department" className="text-sm text-gray-900">
          부서
        </label>
        <Input
          id="department"
          type="text"
          placeholder="근무 부서를 입력해주세요."
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          disabled={isLoading}
          className="flex-1 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-900 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>

      {/* 직급 */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="position" className="text-sm text-gray-900">
          직급
        </label>
        <Input
          id="position"
          type="text"
          placeholder="직급을 입력해주세요."
          value={formData.position}
          onChange={(e) => handleChange('position', e.target.value)}
          disabled={isLoading}
          className="flex-1 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-900 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>

      {/* 이름 */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="name" className="text-sm text-gray-900">
          이름
        </label>
        <Input
          id="name"
          type="text"
          placeholder="이름을 입력해주세요."
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          disabled={isLoading}
          className="flex-1 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-900 focus:border-gray-900 focus:ring-gray-900"
          autoComplete="name"
        />
      </div>

      {/* 전화번호 */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="phone" className="text-sm text-gray-900">
          전화번호
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="전화번호를 입력해주세요."
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          disabled={isLoading}
          className="flex-1 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 text-Pre-14-R text-gray-900 focus:border-gray-900 focus:ring-gray-900"
          autoComplete="tel"
        />
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
        type="submit"
        disabled={isLoading || !isFormComplete}
        className={`w-full rounded-lg px-8 py-2 text-Pre-14-B transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
          isLoading || !isFormComplete
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-900'
        }`}
        aria-label="다음"
      >
        {isLoading ? '처리 중...' : '다음'}
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
    </form>
  )
}

