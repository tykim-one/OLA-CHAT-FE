'use client'

interface LoadingDotsProps {
  className?: string
}

/**
 * Figma 디자인의 로딩 점 애니메이션 컴포넌트
 * 3개의 점이 순차적으로 페이드 인/아웃하는 애니메이션
 */
export default function LoadingDots({ className = '' }: LoadingDotsProps) {
  return (
    <div className={`flex justify-center items-center gap-1 ${className}`}>
      <div
        className="w-2 h-2 bg-gradient-to-r from-slate-900 to-slate-600 rounded-full animate-pulse"
        style={{
          animationDelay: '0ms',
          animationDuration: '1.4s',
        }}
      />
      <div
        className="w-2 h-2 bg-gradient-to-r from-slate-700 to-slate-400 rounded-full animate-pulse"
        style={{
          animationDelay: '200ms',
          animationDuration: '1.4s',
        }}
      />
      <div
        className="w-2 h-2 bg-gradient-to-r from-slate-500 to-slate-200 rounded-full animate-pulse"
        style={{
          animationDelay: '400ms',
          animationDuration: '1.4s',
        }}
      />
    </div>
  )
}
