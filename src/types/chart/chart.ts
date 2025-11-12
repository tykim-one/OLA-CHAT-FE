import { DataSetModel } from '../dataset'
import { AssetModel } from '../editor'
import { ChartOptionValueModel } from '../editor/chart'

export type RenderChartModel = AssetModel & {
  meta: ChartOptionValueModel
} & {
  chartContent: DataSetModel | null
}
