import Image from 'next/image'

interface CompletedReportHeaderProps {
  title: string
  imageSrc: string
}

export const CompletedReportHeader = ({ title, imageSrc }: CompletedReportHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Image src={imageSrc} alt="summary" width={46} height={46} priority />
        <h2 className="text-[#003F88] text-2xl font-bold leading-loose">{title}</h2>
      </div>
      <div className="flex gap-3 items-center">
        <div className="flex border-[2px] border-[#ff0000] text-[#ff0000] p-1.5 rounded-lg text-xs font-bold leading-none h-fit">
          행 내 한
        </div>
        <Image src="/hows.png" alt="how" width={46} height={46} priority />
      </div>
    </div>
  )
}
