'use client'

import React from 'react'

import { additionalAnalysisOptions, requiredAnalysisOptions } from '@/constants/formOptions'
import { useContentConfiguration } from '@/hooks/content'
import { ContentConfigData } from '../../types/report'
import StepNavigationButtons from '../shared/StepNavigationButtons'
import { CheckIcon } from '../shared/icons'

export interface ContentConfigurationProps {
  onSubmit: (data: ContentConfigData) => void
  initialData?: ContentConfigData
  onPrevious?: () => void
}

export default function ContentConfiguration({
  onSubmit,
  initialData,
  onPrevious,
}: ContentConfigurationProps) {
  const { formData, handleChange, handleToggleFocusArea, handleSubmit } = useContentConfiguration({
    initialData,
    onSubmit,
  })

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3 font-pretendard">
        {/* 필수 섹션 */}
        <div className="p-3 bg-white/80 rounded-lg shadow-[0px_-2px_40px_0px_rgba(223,235,255,0.15)] w-full outline outline-1 outline-offset-[-1px] outline-gray-100 inline-flex flex-col justify-start items-start gap-3">
          <h3 className="text-sm text-gray-900 font-medium mb-2">필수 섹션</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
            {requiredAnalysisOptions.map((option) => {
              const isSelected = formData.focusAreas.includes(option.value)
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleToggleFocusArea(option.value)}
                  className={`flex gap-2 cursor-pointer items-center justify-center p-4 border rounded-[8px] h-[36px] transition
                    ${isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}
                    focus:outline-none`}
                  aria-pressed={isSelected}
                  tabIndex={0}
                  aria-label={`${option.label} ${isSelected ? '선택됨' : '선택 안됨'}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleToggleFocusArea(option.value)
                    }
                  }}
                >
                  <span
                    className={`text-sm leading-normal ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}
                  >
                    {option.label}
                  </span>
                    <CheckIcon
                      className={`w-5 h-5 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}
                    />
                </button>
              )
            })}
          </div>
        </div>

        {/* 추가 분석 (Coming Soon) */}
        <div className="p-3 bg-white/80 rounded-lg shadow-[0px_-2px_40px_0px_rgba(223,235,255,0.15)] w-full outline outline-1 outline-offset-[-1px] outline-gray-100 inline-flex flex-col justify-start items-start gap-3">
          <h3 className="text-sm text-gray-900 font-medium mb-2">추가 분석 (Coming Soon)</h3>
          <div className="flex gap-2.5 w-full">
            {additionalAnalysisOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center w-full justify-between p-4 bg-slate-100 rounded-lg h-[36px] cursor-not-allowed opacity-60"
              >
                <span className="text-sm text-gray-400">{option.label}</span>
                  <CheckIcon className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* AI 분석 톤앤매너 */}
        <div className="bg-white rounded-lg">
          <h3 className="text-sm text-gray-900 font-medium mb-2">AI 분석 톤앤매너</h3>
          <div className="relative">
            <select
              value={formData.aiTone}
              onChange={(e) => handleChange('aiTone', e.target.value)}
              disabled
              className="w-full text-sm p-2.5 px-[18px] border border-gray-300 rounded-lg bg-white text-gray-800 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004CA5] focus:border-[#004CA5]"
            >
              <option value="전문적이고 객관적인 톤">전문적이고 객관적인 톤</option>
              <option value="친근하고 이해하기 쉬운 톤">친근하고 이해하기 쉬운 톤</option>
              <option value="간결하고 핵심적인 톤">보수적이고 신중한 톤</option>
              <option value="상세하고 분석적인 톤">적극적이고 기회 중심적인 톤</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <StepNavigationButtons
          nextType="submit"
          onNext={undefined} // form submit will handle this
          onPrevious={onPrevious}
        />
      </form>
    </div>
  )
}
