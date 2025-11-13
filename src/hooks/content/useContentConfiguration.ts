import { useState } from 'react'

import { createFieldHandler, handleFormSubmit } from '@/utils/formUtils'

import { ContentConfigData } from '@/types/report'

import { requiredAnalysisOptions } from '@/constants/formOptions'

interface UseContentConfigurationProps {
  initialData?: ContentConfigData
  onSubmit: (data: ContentConfigData) => void
}

export const useContentConfiguration = ({
  initialData,
  onSubmit,
}: UseContentConfigurationProps) => {
  const requiredAnalysisValues = requiredAnalysisOptions.map((option) => option.value)

  const [formData, setFormData] = useState<ContentConfigData>(
    initialData || {
      contentLength: 'medium',
      includeCharts: true,
      includeTables: true,
      includeSummary: true,
      includeRecommendations: true,
      focusAreas: requiredAnalysisValues,
      focusAreas_kor: [],
      aiTone: '전문적이고 객관적인 톤',
    },
  )

  const FOCUS_AREA_KOR_MAP = requiredAnalysisOptions.reduce(
    (acc, cur) => ({ ...acc, [cur.value]: cur.label }),
    {} as Record<string, string>,
  )

  const handleChange = createFieldHandler(setFormData)

  const handleToggleFocusArea = (value: string) => {
    setFormData((prev) => {
      const isSelected = prev.focusAreas.includes(value)
      const newFocusAreas = isSelected
        ? prev.focusAreas.filter((v) => v !== value)
        : [...prev.focusAreas, value]
      const newFocusAreasKor = newFocusAreas.map((v) => FOCUS_AREA_KOR_MAP[v] || v)

      return {
        ...prev,
        focusAreas: newFocusAreas,
        focusAreas_kor: newFocusAreasKor,
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    handleFormSubmit(e, () => {
      onSubmit(formData)
    })
  }

  return {
    formData,
    handleChange,
    handleToggleFocusArea,
    handleSubmit,
  }
}
