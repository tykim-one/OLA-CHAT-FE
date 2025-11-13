import type { PropsWithChildren } from 'react'

interface ReportSectionTitleProps {
  // 섹션 제목 텍스트를 결정하는 문자열
  title: string
}

// 공통 섹션 제목 컴포넌트: 파란색 바와 제목 텍스트를 재사용합니다.
export const ReportSectionTitle = ({ title }: ReportSectionTitleProps) => {
  return (
    <div className="flex items-center gap-2">
      {/* 제목 왼쪽에 표시되는 강조 바 */}
      <div className="h-9 w-1.5 bg-[#0EA5E9]" />
      {/* 실제 섹션 제목 텍스트 */}
      <h2 className="text-2xl font-bold text-sky-800">{title}</h2>
    </div>
  )
}



