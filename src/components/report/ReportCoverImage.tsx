import Image from 'next/image'

import type { ReportMeta } from '@/types/report'

import { periodImageMap } from '@/constants/report'

interface ReportCoverImageProps {
  reportMeta: ReportMeta
}

export const ReportCoverImage = ({ reportMeta }: ReportCoverImageProps) => {
  const imageSrc = periodImageMap[reportMeta.period]

  if (!imageSrc) {
    return null
  }

  const today = new Date()
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .slice(0, 12)

  return (
    <div className="flex justify-center items-center mb-[50px]">
      <div className="relative">
        <Image src={imageSrc} alt="IBK" width={992} height={701} priority />
        <div
          className="absolute top-[308px] left-[72px] font-bold text-3xl text-white z-10"
          style={{ whiteSpace: 'nowrap' }}
        >
          {reportMeta.title}
        </div>
        <div className="absolute top-[616px] left-[72px] font-bold text-[20px] text-white z-10">
          {today}
        </div>
      </div>
    </div>
  )
}
