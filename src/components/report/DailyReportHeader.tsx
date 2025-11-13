import Image from 'next/image'

interface DailyReportHeaderProps {
  title: string
  highlightWord?: string
  date: string
  theme: string
}

export const DailyReportHeader = ({ title, highlightWord, date, theme }: DailyReportHeaderProps) => {
  const getBackgroundImage = () => {
    switch (theme) {
      case 'FOREX':
        return "url('/daily/forex.png')"
      case 'AI':
        return "url('/daily/ai.png')"
      case 'DIVIDEND':
        return "url('/daily/dividend.png')"
      default:
        return "url('/daily/header.png')"
    }
  }

  return (
    <div
      className="relative w-full h-[84px] p-3 bg-cover bg-center bg-no-repeat flex items-center gap-3"
      style={{
        backgroundImage: getBackgroundImage(),
      }}
    >
      {/* 로고 이미지 */}
      <div className="w-[60px] h-[60px] flex-shrink-0">
        <Image src="/hows.png" alt="IBK Logo" width={60} height={60} className="object-contain" />
      </div>

      {/* 제목 및 정보 */}
      <div className="flex flex-col flex-1 h-14">
        <h1 className="text-[30px] font-bold text-white leading-9">
          {highlightWord && title.includes(highlightWord) ? (
            <>
              {title.split(highlightWord).map((part, index) => (
                <span key={index}>
                  {part}
                  {index < title.split(highlightWord).length - 1 && (
                    <span style={{ color: '#FFD900' }}>{highlightWord}</span>
                  )}
                </span>
              ))}
            </>
          ) : (
            title
          )}
        </h1>
        
        <div className="flex items-center gap-2 h-5">
          <span className="text-sm font-semibold text-white leading-5">자산관리사업부</span>
          <span className="text-sm font-semibold text-white leading-5">작성일: {date}</span>
        </div>
      </div>

      {/* 우측 상단 배지 */}
      <div className="absolute top-6 right-3 w-[74px] h-9 px-3 py-2 bg-red-500 rounded shadow-lg flex items-center justify-center">
        <span className="text-sm font-medium text-white text-center leading-5">행  내  한</span>
      </div>
    </div>
  )
}
