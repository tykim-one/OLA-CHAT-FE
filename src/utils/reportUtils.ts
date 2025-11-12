// 리포트 관련 유틸리티 함수들
import { getTodayKoreanFormat } from './dateUtils'

import { reportTypeOptions } from '../constants/reportFormOptions'

/**
 * 리포트 제목 자동 생성 함수
 * @param reportType 리포트 유형
 * @returns 자동 생성된 제목
 */
export const generateAutoTitle = (reportType: string): string => {
  if (!reportType) return ''

  const reportTypeLabel =
    reportTypeOptions.find((option) => option.value === reportType)?.label || ''

  return `${getTodayKoreanFormat()} IBK ${reportTypeLabel}`
}

/**
 * 리포트 매개변수 생성 함수
 * @param basicInfo 기본 정보
 * @param contentConfig 콘텐츠 설정
 * @returns API 호출용 매개변수
 */
export const createReportParameters = (
  basicInfo: {
    title: string
    reportType: string
    period: string
    aiTone?: string
  },
  contentConfig: {
    aiTone: string
    focusAreas: string[]
  },
) => {
  return {
    title: basicInfo.title,
    date: new Date().toISOString().split('T')[0],
    period: basicInfo.period,
    report_type: basicInfo.reportType,
    ai_tone: contentConfig.aiTone,
    categories: contentConfig.focusAreas,
  }
}
