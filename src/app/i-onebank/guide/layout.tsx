import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI투자챗봇 가이드 - i-OneBank',
  description: 'i-OneBank AI투자챗봇 사용법과 유의사항을 안내합니다.',
  keywords: 'i-OneBank, AI투자챗봇, 투자정보, 인공지능',
}

export default function IOnebankLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full max-w-screen min-h-screen overflow-x-hidden">
      {children}
    </div>
  )
}
