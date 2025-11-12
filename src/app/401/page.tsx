'use client'

import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * 401 인증 오류 페이지
 * 쿼리 파라미터 유효성 검사 실패 시 표시되는 페이지
 */
export default function UnauthorizedPage() {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          인증 오류
        </h1>

        {/* 설명 */}
        <div className="text-gray-600 mb-8 space-y-2">
          <p>앱을 재접속해 주세요.</p>
          <p className="text-sm">인증 정보가 유효하지 않거나 만료되었습니다.</p>
        </div>
      </div>
    </div>
  )
}
