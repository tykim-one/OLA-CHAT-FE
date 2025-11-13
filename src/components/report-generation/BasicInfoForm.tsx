// pages/login.tsx (구조화된 View)

'use client'

import React from 'react'

import StepNavigationButtons from '@/components/shared/StepNavigationButtons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useBasicInfoForm } from '@/hooks/basic-info'

import { BasicInfoFormData } from '@/types/report'

import { periodOptions, reportTypeOptions, targetAudienceOptions } from '@/constants/formOptions'
export interface BasicInfoFormProps {
  onSubmit: (data: BasicInfoFormData) => void
  initialData?: BasicInfoFormData
}

export default function BasicInfoForm({ onSubmit, initialData }: BasicInfoFormProps) {
  const {
    title,
    reportType,
    period,
    targetAudience,
    onTitleChange,
    onReportTypeChange,
    onTargetAudienceChange,
    handleSubmit,
  } = useBasicInfoForm({ initialData, onSubmit })

  return (
    <div className=''>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="report-title" className="text-sm text-gray-900">
            리포트 제목
          </Label>
          <Input
            id="report-title"
            placeholder="예: 2025년 6월 IBK 투자전략 가이드"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="border border-[#E6EBF1] rounded-[10px] !h-[36px] focus-visible:!border-[#E6EBF1] focus-visible:!ring-0 focus-visible:!ring-offset-0 hover:!border-[#E6EBF1] active:!border-[#E6EBF1] !transition-none !shadow-none"
          />
          <div className="text-sm text-gray-600">
            리포트 제목을 미입력시 자동으로 작성해드립니다.
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="report-type" className="text-sm text-gray-900">
            <div className="flex items-start">
              <div className="text-red-500">*</div>
              <div>리포트 유형</div>
            </div>
          </Label>
          <Select value={reportType} onValueChange={onReportTypeChange} required>
            <SelectTrigger
              id="report-type"
              className="w-full border border-[#E6EBF1] rounded-[10px] h-[36px]"
            >
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {reportTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className='mb-1'>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="report-period" className="text-sm text-gray-900 font-medium">
            발행 주기
          </Label>
          <Select value={period} disabled>
            <SelectTrigger className="w-full border border-[#E6EBF1] rounded-[10px] mb-0 h-[36px] opacity-50 cursor-not-allowed">
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="h-[30px] space-y-1.5"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-600 mt-2">*발행주기는 자동으로 선택됩니다.</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-audience" className="text-sm text-gray-900">
            대상 독자
          </Label>
          <Select value={targetAudience} onValueChange={onTargetAudienceChange}>
            <SelectTrigger className="w-full border border-[#E6EBF1] rounded-[10px] mb-0 h-[36px]">
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {targetAudienceOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="h-[30px] mb-1"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-600">
          대상독자를 선택해주세요.
          </div>
        </div>

        <StepNavigationButtons showPrevious={false} nextType="submit" onNext={undefined} />
      </form>
    </div>
  )
}
