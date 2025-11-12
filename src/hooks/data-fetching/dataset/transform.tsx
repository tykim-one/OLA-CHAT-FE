import { DataSetModel, DataSetQueryModel, ExtractDataSetField } from '@/types/dataset'
import { TimeUnit } from '@/types/editor'

import { DataSetDTO, DataSetQueryDTO } from '@/http/dataset/types'

export const transformDataSetDTO = <T extends DataSetQueryModel = DataSetQueryModel>(
  dataSetDTO: DataSetDTO,
): DataSetModel<ExtractDataSetField<T>> => {
  return {
    meta: {
      // s: dataSetDTO.meta.s,
    },
    columns: dataSetDTO.columns.map((column) => ({
      field: column.field,
      type: column.type,
      unit: column.unit,
      scale: column.scale,
      format: column.format,
    })),
    rows: dataSetDTO.rows,
  } as DataSetModel<ExtractDataSetField<T>>
}

// transformDataSetQueryModel은 DataSetQueryDTO 타입을 암호화
export const transformDataSetQueryModel = (
  dataSetQueryModel: DataSetQueryModel,
): DataSetQueryDTO => {
  // const creditUnitMap: Partial<{ [k in TimeUnit]: Credit['unit'] }> = {
  //   YEAR: 'YEAR',
  //   MONTH: 'MONTH',
  // }

  return {
    meta: {
      // plan_id: dataSetQueryModel.meta?.planId!,
      // billing_id: dataSetQueryModel.meta?.id!,
      // block_id: dataSetQueryModel.meta?.blockId!,
      // s: dataSetQueryModel.meta?.s || '',
      market: dataSetQueryModel.meta?.market!,
    },
    config: dataSetQueryModel.config,
    // credit: {
    //   unit: creditUnitMap[dataSetQueryModel.credit?.unit!] || '',
    //   range: dataSetQueryModel.credit?.range || '',
    //   bi: dataSetQueryModel.credit?.id || '',
    //   version: dataSetQueryModel.credit?.version || 0,
    // },
    dataset_selection: {
      from: {
        dataset_type: dataSetQueryModel.datasetSelection.from.datasetType,
      },
      select: {
        fields: [...dataSetQueryModel.datasetSelection.select.fields],
        aggregations: dataSetQueryModel.datasetSelection.select.aggregations?.map((d) => ({
          field: d.field,
          aggregation_function: d.aggregationFunction,
        })),
      },
      filter: {
        conditions: dataSetQueryModel.datasetSelection.filter?.conditions,
      },
      group_by: {
        conditions: dataSetQueryModel.datasetSelection.groupBy?.conditions?.map((d)  => ({
          field: d.field,
          aggregation_type: d.aggregationType,
        })),
      },
      sort: {
        conditions: dataSetQueryModel.datasetSelection.sort?.conditions?.map((d, i) => ({
          ...d,
          priority: i,
        })),
      },
      pagination: {
        limit: dataSetQueryModel.datasetSelection.pagination?.take || 0,
        offset: dataSetQueryModel.datasetSelection.pagination?.skip || 0,
      },
    },
  }
}
