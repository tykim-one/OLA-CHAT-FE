import React from 'react'

type Stock = {
  id: string
  name: string
  ticker: string // 예: "+2.5%"
  iconUrl?: string
}

type Props = {
  stocks: Stock[]
  onQuestionClick: (question: string) => void
}

const PopularStocksToday: React.FC<Props> = ({ stocks, onQuestionClick }) => (
  <div className="flex flex-col">
    <p className="text-body-medium mb-2.5">한 번의 클릭으로 알아보는 종목 정보</p>
    <section
      className="bg-transparent rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2"
      aria-label="오늘의 인기 종목"
    >
      {stocks.map((stock) => (
        <div
          key={stock.id}
          className="flex items-center gap-3 border border-slate-100 bg-white rounded-lg p-3 cursor-pointer hover:shadow transition"
          tabIndex={0}
          aria-label={`${stock.name} ${stock.ticker}`}
          onClick={() => {
            onQuestionClick(`${stock.name} (${stock.ticker}) 종합적으로 분석해줘`)
          }}
        >
          {stock.iconUrl && (
            <img
              src={`/stock/${stock.iconUrl}`}
              alt={`${stock.name} 아이콘`}
              className="w-6 h-6 rounded-full"
            />
          )}
          <div className="flex-1">
            <div className="text-body-medium">{stock.name}</div>
          </div>
        </div>
      ))}
    </section>
  </div>
)

export default PopularStocksToday
