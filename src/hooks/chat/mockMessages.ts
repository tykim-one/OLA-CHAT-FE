
const etfSectorDataset = [
    {
      "ticker": "QQQ",
      "country": "US",
      "etf_name": "QQQ",
      "data": {
        "format_type": "table",
        "title": "QQQ ETF 섹터 구성",
        "description": "QQQ ETF의 섹터별 비중 구성입니다.",
        "data": {
          "headers": [
            "섹터명",
            "비중"
          ],
          "rows": [
            [
              "Technology",
              54.14
            ],
            [
              "Communication Services",
              15.91
            ],
            [
              "Consumer Cyclical",
              12.97
            ],
            [
              "Consumer Defensive",
              5.07
            ],
            [
              "Healthcare",
              4.53
            ],
            [
              "Industrials",
              3.69
            ],
            [
              "Utilities",
              1.41
            ],
            [
              "Basic Materials",
              1.24
            ],
            [
              "Energy",
              0.4622
            ],
            [
              "Financial Services",
              0.36644
            ],
            [
              "Real Estate",
              0.2192
            ]
          ]
        },
        "metadata": {
          "row_count": 11,
          "column_count": 2,
          "total_sectors": 11,
          "formatted_at": "2025-08-27T08:21:25.731451"
        }
      }
    }
  ]

export const mockMessages = [
    {
        id: '17539363781020.18455151484481049',
        type: 'chart_group',
        content: [
        {
            preset: 'PRICE_INFORMATION',
            ticker: 'NVDA',
            market: 'US',
            name: 'NVIDIA',
        },
        ],
        role: 'assistant',
        timestamp: new Date('2025-07-31T04:32:58.102Z'),
    },
    {
        id: '17539363781020.28455151484481049',
        type: 'chart_group',
        content: [
        {
            preset: 'INCOME_STATEMENT_TRENDS',
            ticker: 'NVDA',
            market: 'US',
            name: 'NVIDIA',
        },
        ],
        role: 'assistant',
        timestamp: new Date('2025-07-31T04:32:58.102Z'),
    },
    {
        id: '17539363781020.38455151484481049',
        type: 'chart_group',
        content: [
        {
            preset: 'VALUATION_MULTIPLES_CHART',
            ticker: 'NVDA',
            market: 'US',
            name: 'NVIDIA',
        },
        ],
        role: 'assistant',
        timestamp: new Date('2025-07-31T04:32:58.102Z'),
    },
    {
        id: '27539363781020.38455151484481049',
        type: 'chart_group',
        content: etfSectorDataset.map((dataSet: any) => ({
        preset: 'ETF_WEIGHTS',
        ticker: dataSet.ticker,
        name: dataSet.etf_name, //etf_name
        market: dataSet.country,
        chartContent: {
            meta: {
            s: '',
            },
            columns: [{ field: 'ticker' }, { field: 'weight' }],
            rows: dataSet.data.data.rows.map(([ticker, weight]: any) => {
            return {
                ticker: ticker,
                weight: Number(weight),
            }
            }),
        },
        })),
        role: 'assistant',
        timestamp: new Date(),
    },
] as any