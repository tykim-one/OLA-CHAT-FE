export type AssetModel = {
  target: {
    id: string // 종목아이디
    name: string // 종목이름
    ticker: string // 종목티커
    country: string // 상장국가
  }
}

export type PresetDataOption<T = string> = {
  id: number
  planId: number
  optionType?: 'preset' | 'custom-date-range'
  value: T
  label: string
  cost: number
}
export type PresetDataOptionValue<T = string> = Omit<PresetDataOption<T>, 'optionType' | 'label'>
export type PresetDataOptionGroup<T = string, K = string> = {
  name: K
  label: string
  showLabel?: boolean
  defaultValue?: PresetDataOptionValue<T>
  options: PresetDataOption<T>[]
  useGenerate?: boolean
}

export type PresetDataOptionGroupSelection = {
  optionGroup: string
  defaultValue: PresetDataOptionValue
}
export type PresetDataVisualizationModel<T = string, K = string, N = string, O = string> = {
  name: N
  title: string
  subTitle?: string
  description: string
  visualizationOptions: PresetDataOption<K>[]
  defaultVisualizationOptionValue?: K
  defaultOptionGroupSelection: PresetDataOptionGroupSelection[]
  optionGroups: PresetDataOptionGroup<T, O>[]
  mutuallyExclusiveOptionGroups?: O[][]
  disabled?: boolean
}

export type TimeFrameKey =
  | '1d'
  | '3d'
  | '1w'
  | '1M'
  | '3M'
  | '6M'
  | '1y'
  | '3y'
  | '5y'
  | '10y'
  | 'QUARTERLY'
  | 'HALF_YEAR'
  | 'ANNUAL'
  | 'CUSTOM'

export type TimeRange = { from: string; to: string }

export type TimeOptionValue = TimeFrameKey | TimeRange

export type TimeUnit = 'YEAR' | 'MONTH' | ''
export type TimeFrameUnit = {
  unit: TimeUnit
  value: number
}
