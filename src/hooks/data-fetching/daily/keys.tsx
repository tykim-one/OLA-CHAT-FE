export const keys = {
  GET_DAILY_SUMMARY: (id?: string) => ['getDailySummary', id].filter(Boolean),
} as const

export type DailySummaryKeys = typeof keys

