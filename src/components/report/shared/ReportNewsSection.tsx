import { ReportSectionTitle } from './ReportSectionTitle'

import { decodeHtmlEntities } from '@/utils/htmlDecoder'

import type { NewsItem } from '@/types/dailyReport'

interface ReportNewsSectionProps {
  // 섹션 제목 텍스트
  title: string
  // 표시할 뉴스 데이터 배열
  items: NewsItem[]
  // 최대 표시 개수, 기본값은 6개
  maxItems?: number
}

// 공통 뉴스 섹션 컴포넌트: 3종 리포트에서 재사용 가능하도록 구성합니다.
export const ReportNewsSection = ({ title, items, maxItems = 6 }: ReportNewsSectionProps) => {
  const hasNewsItems = items.length > 0

  if (!hasNewsItems) {
    return (
      <section className="space-y-4">
        <ReportSectionTitle title={title} />

        {/* 데이터 없음 안내 */}
        <div className="flex h-[198px] items-center justify-center rounded bg-slate-50 text-xl text-slate-400">
          발행된 뉴스가 없습니다.
        </div>
      </section>
    )
  }

  const visibleNewsItems = items.slice(0, maxItems)

  return (
    <section className="space-y-4">
      <ReportSectionTitle title={title} />

      {/* 뉴스 목록 */}
      <ul className="flex h-[198px] flex-col gap-1.5 list-disc" role="list">
        {visibleNewsItems.map((newsItem, index) => {
          const newsTitle = decodeHtmlEntities(newsItem.title)
          const ariaLabel = `뉴스: ${newsTitle}${newsItem.source ? `, 출처 ${newsItem.source}` : ''}`

          return (
            <li key={`${newsTitle}-${index}`} className="flex h-7 items-center gap-2.5">
              <div className="flex w-2 flex-shrink-0 items-center justify-center" aria-hidden>
                •
              </div>
              <span className="max-w-[507px] truncate text-xl font-medium leading-7 text-[#334155]" title={newsTitle}>
                {newsTitle}
              </span>
              {newsItem.source ? (
                <div className="flex h-7 flex-shrink-0 items-center rounded-lg bg-[#F3F4F6] px-3">
                  <span className="whitespace-nowrap text-lg leading-7 text-[#4B5563]">{newsItem.source}</span>
                </div>
              ) : null}
              {newsItem.link ? (
                <a
                  href={newsItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-7 flex-shrink-0 items-center justify-center text-base font-medium leading-6 text-[#3B82F6] underline"
                  tabIndex={0}
                  aria-label={`${ariaLabel}, 링크 열기`}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') {
                      return
                    }

                    event.currentTarget.click()
                  }}
                >
                  링크
                </a>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}


