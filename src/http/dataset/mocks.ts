import * as T from './types'

export const mocks = {
  DATASET: {
    status: 200,
    message: 'Success',
    data: {
      // 샘플 데이터셋 응답
      records: [
        {
          id: 1,
          name: 'Sample Dataset',
          type: 'Price',
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      size: 10,
    },
    trace: null,
    path: '/api/v1/dataset/Price',
  },
} as const

export const mockChartData = {
  price: {
    // (3Years)
    payload: {
      target: {
        id: 'US00000000000000018733',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        country: 'US',
      },
      meta: {
        chartPresetType: 'PRICE_INFORMATION',
        visualizationType: 'CANDLESTICK_CHART',
        options: {
          DATE_RANGE: {
            id: 112,
            planId: 2,
            value: '3y',
            cost: 1,
          },
        },
        referenceTime: 1753684513002,
        s: '',
      },
      chartContent: null,
    },
    dataSetQuery: {
      meta: {
        id: 112,
        planId: 2,
        blockId: 'a264aa80-45df-4f96-8f71-c5d731b41d5b',
        s: '',
      },
      config: {
        visualizationType: 'candlestick',
        options: {
          title: 'Price Information',
        },
      },
      datasetSelection: {
        from: {
          datasetType: 'Price',
        },
        select: {
          fields: [
            'ticker',
            'date',
            'open',
            'high',
            'low',
            'close',
            'sma5',
            'sma10',
            'sma20',
            'sma50',
            'sma120',
            'volume',
          ],
        },
        filter: {
          conditions: [
            {
              field: 'ticker',
              operator: 'eq',
              value: 'AAPL',
            },
            {
              field: 'date',
              operator: 'between',
              value: ['20220728', '20250728'],
            },
          ],
        },
        sort: {
          conditions: [
            {
              field: 'date',
              order: 'asc',
            },
          ],
        },
      },
    },
    request: {
      meta: {
        plan_id: 2,
        billing_id: 112,
        block_id: 'a264aa80-45df-4f96-8f71-c5d731b41d5b',
        session_id: 'dataset-session-2a4e661832c34466b93e1ef41551d095',
      },
      config: {
        visualizationType: 'candlestick',
        options: {
          title: 'Price Information',
        },
      },
      dataset_selection: {
        select: {
          fields: [
            'ticker',
            'date',
            'open',
            'high',
            'low',
            'close',
            'sma_5',
            'sma_10',
            'sma_20',
            'sma_50',
            'sma_120',
            'volume',
          ],
        },
        filter: {
          conditions: [
            {
              field: 'ticker',
              operator: 'eq',
              value: 'AAPL',
            },
            {
              field: 'date',
              operator: 'between',
              value: ['20220728', '20250728'],
            },
          ],
        },
        sort: {
          conditions: [
            {
              field: 'date',
              order: 'asc',
              priority: 0,
            },
          ],
        },
        pagination: {
          limit: 0,
          offset: 0,
        },
      },
    },
    response: {
      meta: {
        session_id: 'dataset-session-2a4e661832c34466b93e1ef41551d095',
      },
      columns: [
        { field: 'ticker', unit: null, scale: null },
        { field: 'date', unit: null, scale: null },
        { field: 'open', unit: null, scale: null },
        { field: 'high', unit: null, scale: null },
        { field: 'low', unit: null, scale: null },
        { field: 'close', unit: 'USD', scale: null },
        { field: 'sma_5', unit: null, scale: null },
        { field: 'sma_10', unit: null, scale: null },
        { field: 'sma_20', unit: null, scale: null },
        { field: 'sma_50', unit: null, scale: null },
        { field: 'sma_120', unit: null, scale: null },
        { field: 'volume', unit: null, scale: null },
      ],
      rows: [
        {
          ticker: 'AAPL',
          date: '2022-11-03',
          open: 142.06,
          high: 142.8,
          low: 138.75,
          close: 138.88,
          sma_5: 148.728,
          sma_10: 148.685,
          sma_20: 144.973,
          sma_50: 150.0812,
          sma_120: 150.31025,
          volume: 97918516,
        },
      ],
    },
    dataSet: {
      meta: {
        s: 'dataset-session-2a4e661832c34466b93e1ef41551d095',
      },
      columns: [
        { field: 'ticker', unit: null, scale: null },
        { field: 'date', unit: null, scale: null },
        { field: 'open', unit: null, scale: null },
        { field: 'high', unit: null, scale: null },
        { field: 'low', unit: null, scale: null },
        { field: 'close', unit: 'USD', scale: null },
        { field: 'sma5', unit: null, scale: null },
        { field: 'sma10', unit: null, scale: null },
        { field: 'sma20', unit: null, scale: null },
        { field: 'sma50', unit: null, scale: null },
        { field: 'sma120', unit: null, scale: null },
        { field: 'volume', unit: null, scale: null },
      ],
      rows: [
        {
          ticker: 'AAPL',
          date: '2022-07-28',
          open: 156.98,
          high: 157.64,
          low: 154.41,
          close: 157.35,
          sma5: 154.556,
          sma10: 152.941,
          sma20: 148.381,
          sma50: 143.9584,
          sma120: 156.04741666666666,
          volume: 81378731,
        },
      ],
    },
  },
  incomeStatement: {
    // (Annual, 5Years)
    payload: {
      target: {
        id: 'US00000000000000018733',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        country: 'US',
      },
      meta: {
        chartPresetType: 'INCOME_STATEMENT_TRENDS',
        visualizationType: 'BAR_CHART',
        options: {
          DATE_RANGE_ANNUAL: {
            id: 31,
            planId: 2,
            value: '5y',
            cost: 1,
          },
          DATE_RANGE_QUARTERLY: {
            id: 0,
            planId: 0,
            value: '',
            cost: 0,
          },
        },
        referenceTime: 1753685188017,
        s: '',
      },
      chartContent: null,
    },
    dataSetQuery: {
      meta: {
        id: 31,
        planId: 2,
        blockId: '3c9d9a53-d7be-423a-96c5-8523a2ad4408',
        s: '',
      },
      config: {
        visualizationType: 'bar',
        options: {
          title: 'Income Statement Trends',
        },
      },
      datasetSelection: {
        from: {
          datasetType: 'Finance',
        },
        select: {
          fields: [
            'ticker',
            'bsDate',
            'fiscalYear',
            'period',
            'revenue',
            'netIncome',
            'operatingIncome',
            'operatingProfitMargin',
          ],
        },
        filter: {
          conditions: [
            {
              field: 'ticker',
              operator: 'eq',
              value: 'AAPL',
            },
            {
              field: 'bsDate',
              operator: 'between',
              value: ['20200728', '20250728'],
            },
            {
              field: 'period',
              operator: 'in',
              value: ['FY'],
            },
          ],
        },
        sort: {
          conditions: [
            {
              field: 'bsDate',
              order: 'asc',
            },
          ],
        },
      },
    },
    request: {
      meta: {
        plan_id: 2,
        billing_id: 31,
        block_id: '3c9d9a53-d7be-423a-96c5-8523a2ad4408',
        session_id: 'dataset-session-eb95df58427b41b5b0dba6ad2d8bcd7f',
      },
      config: {
        visualizationType: 'bar',
        options: {
          title: 'Income Statement Trends',
        },
      },
      dataset_selection: {
        select: {
          fields: [
            'ticker',
            'bs_filling_date',
            'fiscal_year',
            'period',
            'is_revenue',
            'is_net_income',
            'is_operating_income',
            'ra_operating_profit_margin',
          ],
        },
        filter: {
          conditions: [
            {
              field: 'ticker',
              operator: 'eq',
              value: 'AAPL',
            },
            {
              field: 'bs_filling_date',
              operator: 'between',
              value: ['20200728', '20250728'],
            },
            {
              field: 'period',
              operator: 'in',
              value: ['FY'],
            },
          ],
        },
        sort: {
          conditions: [
            {
              field: 'bs_filling_date',
              order: 'asc',
              priority: 0,
            },
          ],
        },
        pagination: {
          limit: 0,
          offset: 0,
        },
      },
    },
    response: {
      meta: {
        session_id: 'dataset-session-eb95df58427b41b5b0dba6ad2d8bcd7f',
      },
      columns: [
        { field: 'ticker', unit: null, scale: null },
        { field: 'bs_filling_date', unit: null, scale: null },
        { field: 'fiscal_year', unit: null, scale: null },
        { field: 'period', unit: null, scale: null },
        { field: 'is_revenue', unit: 'USD', scale: 'MILLION' },
        { field: 'is_net_income', unit: 'USD', scale: 'MILLION' },
        { field: 'is_operating_income', unit: 'USD', scale: 'MILLION' },
        { field: 'ra_operating_profit_margin', unit: '%', scale: null },
      ],
      rows: [
        {
          ticker: 'AAPL',
          bs_filling_date: '2020-10-30',
          fiscal_year: 2020,
          period: 'FY',
          is_revenue: 274515,
          is_net_income: 57411,
          is_operating_income: 66288,
          ra_operating_profit_margin: 24.147314354406863,
        },
        {
          ticker: 'AAPL',
          bs_filling_date: '2021-10-29',
          fiscal_year: 2021,
          period: 'FY',
          is_revenue: 365817,
          is_net_income: 94680,
          is_operating_income: 108949,
          ra_operating_profit_margin: 29.782377527561593,
        },
        {
          ticker: 'AAPL',
          bs_filling_date: '2022-10-28',
          fiscal_year: 2022,
          period: 'FY',
          is_revenue: 394328,
          is_net_income: 99803,
          is_operating_income: 119437,
          ra_operating_profit_margin: 30.288744395528592,
        },
        {
          ticker: 'AAPL',
          bs_filling_date: '2023-11-03',
          fiscal_year: 2023,
          period: 'FY',
          is_revenue: 383285,
          is_net_income: 96995,
          is_operating_income: 114301,
          ra_operating_profit_margin: 29.821412265024723,
        },
        {
          ticker: 'AAPL',
          bs_filling_date: '2024-11-01',
          fiscal_year: 2024,
          period: 'FY',
          is_revenue: 391035,
          is_net_income: 93736,
          is_operating_income: 123216,
          ra_operating_profit_margin: 31.510222870075566,
        },
      ],
    },
    dataSet: {
      meta: {
        s: 'dataset-session-eb95df58427b41b5b0dba6ad2d8bcd7f',
      },
      columns: [
        { field: 'ticker', unit: null, scale: null },
        { field: 'bsDate', unit: null, scale: null },
        { field: 'fiscalYear', unit: null, scale: null },
        { field: 'period', unit: null, scale: null },
        { field: 'revenue', unit: 'USD', scale: 'MILLION' },
        { field: 'netIncome', unit: 'USD', scale: 'MILLION' },
        { field: 'operatingIncome', unit: 'USD', scale: 'MILLION' },
        { field: 'operatingProfitMargin', unit: '%', scale: null },
      ],
      rows: [
        {
          ticker: 'AAPL',
          bsDate: '2020-10-30',
          fiscalYear: 2020,
          period: 'FY',
          revenue: 274515,
          netIncome: 57411,
          operatingIncome: 66288,
          operatingProfitMargin: 24.147314354406863,
        },
        {
          ticker: 'AAPL',
          bsDate: '2021-10-29',
          fiscalYear: 2021,
          period: 'FY',
          revenue: 365817,
          netIncome: 94680,
          operatingIncome: 108949,
          operatingProfitMargin: 29.782377527561593,
        },
        {
          ticker: 'AAPL',
          bsDate: '2022-10-28',
          fiscalYear: 2022,
          period: 'FY',
          revenue: 394328,
          netIncome: 99803,
          operatingIncome: 119437,
          operatingProfitMargin: 30.288744395528592,
        },
        {
          ticker: 'AAPL',
          bsDate: '2023-11-03',
          fiscalYear: 2023,
          period: 'FY',
          revenue: 383285,
          netIncome: 96995,
          operatingIncome: 114301,
          operatingProfitMargin: 29.821412265024723,
        },
        {
          ticker: 'AAPL',
          bsDate: '2024-11-01',
          fiscalYear: 2024,
          period: 'FY',
          revenue: 391035,
          netIncome: 93736,
          operatingIncome: 123216,
          operatingProfitMargin: 31.510222870075566,
        },
      ],
    },
  },
  priceBasedValuation: {
    // (Annual, 5Years)
    payload: {
      target: {
        id: 'US00000000000000018733',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        country: 'US',
      },
      meta: {
        chartPresetType: 'VALUATION_MULTIPLES_CHART',
        visualizationType: 'LINE_CHART',
        options: {
          DATE_RANGE_ANNUAL: {
            id: 23,
            planId: 2,
            value: '5y',
            cost: 1,
          },
          DATE_RANGE_QUARTERLY: {
            id: 0,
            planId: 0,
            value: '',
            cost: 0,
          },
        },
        referenceTime: 1753685648534,
        s: '',
      },
      chartContent: null,
    },
    dataSetQuery: {
      meta: {
        id: 23,
        planId: 2,
        blockId: '0957d200-0ea5-46f3-b49e-6569720d80e9',
        s: '',
      },
      config: {
        visualizationType: 'line',
        options: {
          title: 'Valuation Multiples Chart',
        },
      },
      datasetSelection: {
        from: {
          datasetType: 'Finance',
        },
        select: {
          fields: [
            'ticker',
            'bsDate',
            'fiscalYear',
            'period',
            'peRatio',
            'pbRatio',
            'priceToSalesRatio',
            'priceToFreeCashFlowRatio',
            'priceToOperatingCashFlowRatio',
          ],
        },
        filter: {
          conditions: [
            {
              field: 'ticker',
              operator: 'eq',
              value: 'AAPL',
            },
            {
              field: 'bsDate',
              operator: 'between',
              value: ['20200728', '20250728'],
            },
            {
              field: 'period',
              operator: 'in',
              value: ['FY'],
            },
          ],
        },
        sort: {
          conditions: [
            {
              field: 'bsDate',
              order: 'asc',
            },
          ],
        },
      },
    },
    request: {
      meta: {
        plan_id: 2,
        billing_id: 23,
        block_id: '0957d200-0ea5-46f3-b49e-6569720d80e9',
        session_id: 'dataset-session-cac500d4f64f400b9c1a502c1ff98b8d',
      },
      config: {
        visualizationType: 'line',
        options: {
          title: 'Valuation Multiples Chart',
        },
      },
      dataset_selection: {
        select: {
          fields: [
            'ticker',
            'bs_filling_date',
            'fiscal_year',
            'period',
            'ra_price_to_earnings_ratio',
            'ra_price_to_book_ratio',
            'ra_price_to_sales_ratio',
            'ra_price_to_free_cash_flow_ratio',
            'ra_price_to_operating_cash_flow_ratio',
          ],
        },
        filter: {
          conditions: [
            {
              field: 'ticker',
              operator: 'eq',
              value: 'AAPL',
            },
            {
              field: 'bs_filling_date',
              operator: 'between',
              value: ['20200728', '20250728'],
            },
            {
              field: 'period',
              operator: 'in',
              value: ['FY'],
            },
          ],
        },
        sort: {
          conditions: [
            {
              field: 'bs_filling_date',
              order: 'asc',
              priority: 0,
            },
          ],
        },
        pagination: {
          limit: 0,
          offset: 0,
        },
      },
    },
    response: {
      meta: {
        session_id: 'dataset-session-cac500d4f64f400b9c1a502c1ff98b8d',
      },
      columns: [
        { field: 'ticker', unit: null, scale: null },
        { field: 'bs_filling_date', unit: null, scale: null },
        { field: 'fiscal_year', unit: null, scale: null },
        { field: 'period', unit: null, scale: null },
        { field: 'ra_price_to_earnings_ratio', unit: null, scale: null },
        { field: 'ra_price_to_book_ratio', unit: null, scale: null },
        { field: 'ra_price_to_sales_ratio', unit: null, scale: null },
        { field: 'ra_price_to_free_cash_flow_ratio', unit: null, scale: null },
        { field: 'ra_price_to_operating_cash_flow_ratio', unit: null, scale: null },
      ],
      rows: [
        {
          ticker: 'AAPL',
          bs_filling_date: '2020-10-30',
          fiscal_year: 2020,
          period: 'FY',
          ra_price_to_earnings_ratio: 33.93593425162425,
          ra_price_to_book_ratio: 29.818269660080503,
          ra_price_to_sales_ratio: 7.0972293729668685,
          ra_price_to_free_cash_flow_ratio: 26.556204202548898,
          ra_price_to_operating_cash_flow_ratio: 24.150233300939583,
        },
        {
          ticker: 'AAPL',
          bs_filling_date: '2021-10-29',
          fiscal_year: 2021,
          period: 'FY',
          ra_price_to_earnings_ratio: 25.916253509083226,
          ra_price_to_book_ratio: 38.89286546584245,
          ra_price_to_sales_ratio: 6.707591178758778,
          ra_price_to_free_cash_flow_ratio: 26.39775889148279,
          ra_price_to_operating_cash_flow_ratio: 23.585140835463964,
        },
        {
          ticker: 'AAPL',
          bs_filling_date: '2022-10-28',
          fiscal_year: 2022,
          period: 'FY',
          ra_price_to_earnings_ratio: 24.441823533260525,
          ra_price_to_book_ratio: 48.14034011071204,
          ra_price_to_sales_ratio: 6.186137718067193,
          ra_price_to_free_cash_flow_ratio: 21.888923611981014,
          ra_price_to_operating_cash_flow_ratio: 19.970096962693717,
        },
        {
          ticker: 'AAPL',
          bs_filling_date: '2023-11-03',
          fiscal_year: 2023,
          period: 'FY',
          ra_price_to_earnings_ratio: 27.790811789370586,
          ra_price_to_book_ratio: 43.37479145093811,
          ra_price_to_sales_ratio: 7.032807935374461,
          ra_price_to_free_cash_flow_ratio: 27.06830203155125,
          ra_price_to_operating_cash_flow_ratio: 24.384807626986785,
        },
        {
          ticker: 'AAPL',
          bs_filling_date: '2024-11-01',
          fiscal_year: 2024,
          period: 'FY',
          ra_price_to_earnings_ratio: 37.287278415656736,
          ra_price_to_book_ratio: 61.37243774486391,
          ra_price_to_sales_ratio: 8.93822887866815,
          ra_price_to_free_cash_flow_ratio: 32.12256867269569,
          ra_price_to_operating_cash_flow_ratio: 29.55638142954995,
        },
      ],
    },
    dataSet: {
      meta: {
        s: 'dataset-session-cac500d4f64f400b9c1a502c1ff98b8d',
      },
      columns: [
        { field: 'ticker', unit: null, scale: null },
        { field: 'bsDate', unit: null, scale: null },
        { field: 'fiscalYear', unit: null, scale: null },
        { field: 'period', unit: null, scale: null },
        { field: 'peRatio', unit: null, scale: null },
        { field: 'pbRatio', unit: null, scale: null },
        { field: 'priceToSalesRatio', unit: null, scale: null },
        { field: 'priceToFreeCashFlowRatio', unit: null, scale: null },
        { field: 'priceToOperatingCashFlowRatio', unit: null, scale: null },
      ],
      rows: [
        {
          ticker: 'AAPL',
          bsDate: '2020-10-30',
          fiscalYear: 2020,
          period: 'FY',
          peRatio: 33.93593425162425,
          pbRatio: 29.818269660080503,
          priceToSalesRatio: 7.0972293729668685,
          priceToFreeCashFlowRatio: 26.556204202548898,
          priceToOperatingCashFlowRatio: 24.150233300939583,
        },
        {
          ticker: 'AAPL',
          bsDate: '2021-10-29',
          fiscalYear: 2021,
          period: 'FY',
          peRatio: 25.916253509083226,
          pbRatio: 38.89286546584245,
          priceToSalesRatio: 6.707591178758778,
          priceToFreeCashFlowRatio: 26.39775889148279,
          priceToOperatingCashFlowRatio: 23.585140835463964,
        },
        {
          ticker: 'AAPL',
          bsDate: '2022-10-28',
          fiscalYear: 2022,
          period: 'FY',
          peRatio: 24.441823533260525,
          pbRatio: 48.14034011071204,
          priceToSalesRatio: 6.186137718067193,
          priceToFreeCashFlowRatio: 21.888923611981014,
          priceToOperatingCashFlowRatio: 19.970096962693717,
        },
        {
          ticker: 'AAPL',
          bsDate: '2023-11-03',
          fiscalYear: 2023,
          period: 'FY',
          peRatio: 27.790811789370586,
          pbRatio: 43.37479145093811,
          priceToSalesRatio: 7.032807935374461,
          priceToFreeCashFlowRatio: 27.06830203155125,
          priceToOperatingCashFlowRatio: 24.384807626986785,
        },
        {
          ticker: 'AAPL',
          bsDate: '2024-11-01',
          fiscalYear: 2024,
          period: 'FY',
          peRatio: 37.287278415656736,
          pbRatio: 61.37243774486391,
          priceToSalesRatio: 8.93822887866815,
          priceToFreeCashFlowRatio: 32.12256867269569,
          priceToOperatingCashFlowRatio: 29.55638142954995,
        },
      ],
    },
  },
  priceDividend: {
    // (10Years)
    payload: {
      target: {
        id: 'US00000000000000018733',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        country: 'US',
      },
      meta: {
        chartPresetType: 'PRICE_AND_DIVIDEND_CHART',
        visualizationType: 'LINE_CHART',
        options: {
          DATE_RANGE: {
            id: 20,
            planId: 3,
            value: '10y',
            cost: 1,
          },
        },
        referenceTime: 1753685777687,
        s: 'dataset-session-8f5150b3ada5402786f6b3c8c8359880',
      },
      chartContent: null,
    },
    dataSetQuery: {
      meta: {
        id: 20,
        planId: 3,
        blockId: 'e6a8e949-2d43-4354-b1c7-c8fd6367715a',
        s: 'dataset-session-8f5150b3ada5402786f6b3c8c8359880',
      },
      config: {
        visualizationType: 'line',
        options: {
          title: 'Price & Dividend Chart',
        },
      },
      datasetSelection: {
        from: {
          datasetType: 'Price',
        },
        select: {
          fields: ['ticker', 'date', 'close', 'dividend'],
        },
        filter: {
          conditions: [
            {
              field: 'ticker',
              operator: 'eq',
              value: 'AAPL',
            },
            {
              field: 'date',
              operator: 'between',
              value: ['20150728', '20250728'],
            },
          ],
        },
        sort: {
          conditions: [
            {
              field: 'date',
              order: 'asc',
            },
          ],
        },
      },
    },
    request: {
      meta: {
        plan_id: 3,
        billing_id: 20,
        block_id: 'e6a8e949-2d43-4354-b1c7-c8fd6367715a',
        session_id: 'dataset-session-8f5150b3ada5402786f6b3c8c8359880',
      },
      config: {
        visualizationType: 'line',
        options: {
          title: 'Price & Dividend Chart',
        },
      },
      dataset_selection: {
        select: {
          fields: ['ticker', 'date', 'close', 'dividend'],
        },
        filter: {
          conditions: [
            {
              field: 'ticker',
              operator: 'eq',
              value: 'AAPL',
            },
            {
              field: 'date',
              operator: 'between',
              value: ['20150728', '20250728'],
            },
          ],
        },
        sort: {
          conditions: [
            {
              field: 'date',
              order: 'asc',
              priority: 0,
            },
          ],
        },
        pagination: {
          limit: 0,
          offset: 0,
        },
      },
    },
    response: {
      meta: {
        session_id: 'dataset-session-8f5150b3ada5402786f6b3c8c8359880',
      },
      columns: [
        { field: 'ticker', unit: null, scale: null },
        { field: 'date', unit: null, scale: null },
        { field: 'close', unit: 'USD', scale: null },
        { field: 'dividend', unit: 'USD', scale: null },
      ],
      rows: [
        {
          ticker: 'AAPL',
          date: '2025-06-18',
          close: 196.58,
          dividend: null,
        },
        {
          ticker: 'AAPL',
          date: '2025-06-20',
          close: 201,
          dividend: null,
        },
        {
          ticker: 'AAPL',
          date: '2025-06-23',
          close: 201.5,
          dividend: null,
        },
      ],
    },
    dataSet: {
      meta: {
        s: 'dataset-session-8f5150b3ada5402786f6b3c8c8359880',
      },
      columns: [
        { field: 'ticker', unit: null, scale: null },
        { field: 'date', unit: null, scale: null },
        { field: 'close', unit: 'USD', scale: null },
        { field: 'dividend', unit: 'USD', scale: null },
      ],
      rows: [
        {
          ticker: 'AAPL',
          date: '2015-07-28',
          close: 30.8449993133545,
          dividend: null,
        },
      ],
    },
  },
}
