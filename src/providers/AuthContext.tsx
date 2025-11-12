'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

import { useLoginMutation } from '@/hooks/data-fetching/auth/hooks'

import { LoginRequest } from '@/types/auth/model'

import { AuthContextType, User } from '@/types/auth'

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 인증 프로바이더 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // React Query 로그인 mutation 사용
  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      // 로그인 성공 시 토큰과 사용자 정보를 상태와 로컬 스토리지에 저장
      if (data.access_token) {
        setToken(data.access_token)
        // 클라이언트 사이드에서만 localStorage 접근
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', data.access_token)
        }
      }
      // 필요시 사용자 정보도 저장
      // setUser(data.user)
      // if (typeof window !== 'undefined') {
      //   localStorage.setItem('auth_user', JSON.stringify(data.user))
      // }
    },
    onError: (error) => {
      // 에러 처리는 컴포넌트에서 처리하도록 위임
      console.error('로그인 실패:', error)
    },
    onSettled: () => {
      // 로딩 상태 해제는 mutation이 완료된 후
      setIsLoading(false)
    },
  })

  // 컴포넌트가 마운트될 때 저장된 토큰 확인
  useEffect(() => {
    // 클라이언트 사이드에서만 localStorage 접근
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token')
      // const savedUser = localStorage.getItem('auth_user')

      if (savedToken) {
        setToken(savedToken)
        // setUser(JSON.parse(savedUser))
      }
    }
    setIsLoading(false)
  }, [])

  // 로그인 함수 - React Query mutation 사용
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      const loginRequest: LoginRequest = {
        grant_type: 'password',
        username: email,
        password: password,
      }

      // React Query mutation 실행
      const result = await loginMutation.mutateAsync(loginRequest)

      // AuthContextType에 맞는 형태로 반환
      return {
        token: result.access_token || '',
        status: result.status || '',
      }
    } catch (error) {
      setIsLoading(false)
      throw new Error('로그인에 실패했습니다.')
    }
  }

  // 로그아웃 함수
  const logout = () => {
    setToken(null)
    setUser(null)
    // 클라이언트 사이드에서만 localStorage 접근
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('redirectAfterLogin')
    }
  }

  // mutation의 로딩 상태도 고려
  const contextIsLoading = isLoading || loginMutation.isPending

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading: contextIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 인증 컨텍스트 사용 훅
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
