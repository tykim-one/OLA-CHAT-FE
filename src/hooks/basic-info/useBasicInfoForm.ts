// hooks/useBasicInfoForm.ts (구조화된 ViewModel)
import { useEffect, useState } from 'react'

import { handleFormSubmit, showValidationMessage } from '@/utils/formUtils'
import { generateAutoTitle } from '@/utils/reportUtils'

import { useReportBasicInfo } from '@/providers/ReportContext'

import { BasicInfoFormData } from '@/types/report'

import { reportTypePeriodMapping } from '@/constants/formOptions'

export interface BasicInfoViewModel {
  title: string
  reportType: string
  period: string
  targetAudience: string

  onTitleChange: (value: string) => void
  onReportTypeChange: (value: string) => void
  onTargetAudienceChange: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
}

interface UseBasicInfoFormProps {
  initialData?: BasicInfoFormData
  onSubmit: (data: BasicInfoFormData) => void
}

export const useBasicInfoForm = ({
  initialData,
  onSubmit,
}: UseBasicInfoFormProps): BasicInfoViewModel => {
  const { basicInfo, setBasicInfo } = useReportBasicInfo()

  const [title, setTitle] = useState(initialData?.title || basicInfo?.title || '')
  const [reportType, setReportType] = useState(
    initialData?.reportType || basicInfo?.reportType || '',
  )
  const [period, setPeriod] = useState(initialData?.period || basicInfo?.period || '')
  const [targetAudience, setTargetAudience] = useState(
    initialData?.targetAudience || basicInfo?.targetAudience || '',
  )

  useEffect(() => {
    if (reportType) {
      const mapped = reportTypePeriodMapping[reportType as keyof typeof reportTypePeriodMapping]
      if (mapped) setPeriod(mapped)
    }
  }, [reportType])

  const handleSubmit = (e: React.FormEvent) => {
    handleFormSubmit(e, () => {
      if (!reportType) {
        showValidationMessage('리포트 유형을 선택해주세요!', 'info')
        document.getElementById('report-type')?.focus()
        return
      }

      if (!period) {
        showValidationMessage('발행 주기를 확인해주세요!', 'info')
        return
      }

      const finalData: BasicInfoFormData = {
        title: title.trim() || generateAutoTitle(reportType),
        reportType,
        period,
        targetAudience,
      }

      setBasicInfo(finalData)
      onSubmit(finalData)
    })
  }

  return {
    title,
    reportType,
    period,
    targetAudience,
    onTitleChange: setTitle,
    onReportTypeChange: setReportType,
    onTargetAudienceChange: setTargetAudience,
    handleSubmit,
  }
}
