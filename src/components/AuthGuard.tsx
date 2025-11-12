// src/components/auth/AuthGuard.tsx
'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthContext'

// 인증 없이 접근 가능한 페이지 목록
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/401',
]

// 특정 경로가 공개 경로인지 확인
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 로딩이 완료되고, 토큰이 없고, 공개 페이지가 아니면
    if (!isLoading && !token && !isPublicRoute(pathname)) {
      // 현재 경로를 저장하여 로그인 후 돌아올 수 있도록
      sessionStorage.setItem('redirectAfterLogin', pathname)
      router.push('/login')
    }
  }, [token, isLoading, pathname, router])

  // 로딩 중이면 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 토큰이 없고 공개 페이지가 아니면 null (리다이렉트 진행 중)
  if (!token && !isPublicRoute(pathname)) {
    return null
  }

  // 정상적으로 children 렌더링
  return <>{children}</>
}