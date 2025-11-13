import { Components } from '@ola-b2b/ui'

import { imageMapping } from '@/constants/report'

import { CompletedReportHeader } from './CompletedReportHeader'

interface CompletedReportContainerProps {
  headerTitle: string
  title: string
  content: string[]
  image?: string
  pageNumber: number
}

export const CompletedReportContainer = ({
  headerTitle,
  title,
  content,
  image,
  pageNumber,
}: CompletedReportContainerProps) => {
  const imageSrc = imageMapping[headerTitle]

  return (
    <div className="bg-white relative mb-[50px] px-[38px] pb-[44px] pt-[24px] flex flex-col gap-3 border border-grayscale-b100 max-w-[992px] max-h-[700px] w-full h-full justify-self-center">
      <CompletedReportHeader title={headerTitle} imageSrc={imageSrc} />
      <Components.Separator className="h-[1px] bg-slate-200" />
      <div className="max-h-[275px] h-full space-y-3">
        <h2 className="self-stretch justify-center text-slate-900 text-xl font-semibold leading-7">
          {title}
        </h2>
        <ul className="list-disc pl-5 self-stretch justify-start text-slate-700 text-base font-normal leading-normal space-y-3">
          {content.map((item, index) => (
            <li key={index} className="">
              {item}
            </li>
          ))}
        </ul>
      </div>
      {image && <img src={image} alt="Report Image" className="w-full max-h-[275px] h-full" />}
      <div className="absolute bottom-5 right-9 text-xs text-slate-700 font-normal">
        {String(pageNumber).padStart(2, '0')}
      </div>
    </div>
  )
}
