'use client'

import React from 'react'

import BasicInfoForm, { BasicInfoFormProps } from './BasicInfoForm'
import ContentConfiguration, { ContentConfigurationProps } from './ContentConfiguration'
import PreviewAndGenerate, { PreviewAndGenerateProps } from './PreviewAndGenerate'

interface StepComponentRendererProps {
  stepProps: {
    component: string
    props: BasicInfoFormProps | ContentConfigurationProps | PreviewAndGenerateProps
  } | null
}

export default function StepComponentRenderer({ stepProps }: StepComponentRendererProps) {
  if (!stepProps) {
    return null
  }

  switch (stepProps.component) {
    case 'BasicInfoForm':
      return <BasicInfoForm {...(stepProps.props as BasicInfoFormProps)} />
    case 'ContentConfiguration':
      return <ContentConfiguration {...(stepProps.props as ContentConfigurationProps)} />
    case 'PreviewAndGenerate': {
      const previewProps = stepProps.props as PreviewAndGenerateProps

      // reportData 안전성 확인
      if (!previewProps.reportData) {
        return <div>데이터를 불러오는 중...</div>
      }

      // contentConfig 안전성 확인 및 직렬화 방지
      const safeReportData = {
        ...previewProps.reportData,
        contentConfig: previewProps.reportData.contentConfig
          ? {
              contentLength: String(previewProps.reportData.contentConfig.contentLength || ''),
              includeCharts: Boolean(previewProps.reportData.contentConfig.includeCharts),
              includeTables: Boolean(previewProps.reportData.contentConfig.includeTables),
              includeSummary: Boolean(previewProps.reportData.contentConfig.includeSummary),
              includeRecommendations: Boolean(
                previewProps.reportData.contentConfig.includeRecommendations,
              ),
              focusAreas: Array.isArray(previewProps.reportData.contentConfig.focusAreas)
                ? previewProps.reportData.contentConfig.focusAreas
                : [],
              focusAreas_kor: Array.isArray(previewProps.reportData.contentConfig.focusAreas_kor)
                ? previewProps.reportData.contentConfig.focusAreas_kor
                : [],
              aiTone: String(previewProps.reportData.contentConfig.aiTone || ''),
            }
          : {
              contentLength: '',
              includeCharts: false,
              includeTables: false,
              includeSummary: false,
              includeRecommendations: false,
              focusAreas: [],
              focusAreas_kor: [],
              aiTone: '',
            },
      }

      return (
        <PreviewAndGenerate
          reportData={safeReportData}
          onGenerate={previewProps.onGenerate}
          onGenerationComplete={previewProps.onGenerationComplete}
          onEdit={previewProps.onEdit}
          onPrevious={previewProps.onPrevious}
          isGenerating={previewProps.isGenerating}
          generatedId={previewProps.generatedId}
        />
      )
    }
    default:
      return null
  }
}
