'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export interface Step {
  id: number
  title: string
  path: string
}

interface StepSidebarProps {
  steps: Step[]
  currentStep: number
}

// 각 단계별 완료 상태를 확인하는 함수
const checkStepCompletion = (stepId: number): boolean => {
  // 브라우저 환경이 아닌 경우 false 반환
  if (typeof window === 'undefined') return false

  try {
    switch (stepId) {
      case 1: // 기본 정보
        const basicInfoStr = localStorage.getItem('reportBasicInfo')
        if (!basicInfoStr) return false

        const basicInfo = JSON.parse(basicInfoStr)
        return !!(basicInfo.reportType?.trim() && basicInfo.period?.trim())

      case 2: // 템플릿 선택
        const templateId = localStorage.getItem('reportTemplateId')
        return !!templateId?.trim()

      case 3: // 데이터 소스
        const dataSourceStr = localStorage.getItem('reportDataSource')
        if (!dataSourceStr) return false

        const dataSource = JSON.parse(dataSourceStr)
        return !!(
          dataSource.selectedSources &&
          Array.isArray(dataSource.selectedSources) &&
          dataSource.selectedSources.length > 0
        )

      case 4: // 콘텐츠 설정
        const contentConfigStr = localStorage.getItem('reportContentConfig')
        if (!contentConfigStr) return false

        const contentConfig = JSON.parse(contentConfigStr)
        return !!contentConfig.aiTone?.trim()

      default:
        return false
    }
  } catch (error) {
    // JSON 파싱 에러 등이 발생한 경우 false 반환
    console.error(`Error checking completion for step ${stepId}:`, error)
    return false
  }
}

// 특정 단계에 접근 가능한지 확인하는 함수
const canAccessStep = (stepId: number, completedSteps: Record<number, boolean>): boolean => {
  // 1단계는 항상 접근 가능
  if (stepId === 1) return true

  // 현재 단계 이전의 모든 단계가 완료되었는지 확인
  for (let i = 1; i < stepId; i++) {
    if (!completedSteps[i]) {
      return false
    }
  }
  return true
}

// 미완료된 단계 중 가장 먼저 완료해야 할 단계를 찾는 함수
const getFirstIncompleteStep = (
  stepId: number,
  completedSteps: Record<number, boolean>,
): number => {
  for (let i = 1; i < stepId; i++) {
    if (!completedSteps[i]) {
      return i
    }
  }
  return stepId
}

// 단계별 필요한 정보를 알려주는 함수
const getStepRequiredInfo = (stepId: number): string => {
  switch (stepId) {
    case 1:
      return '📝 리포트 유형과 발행 주기를 선택해주세요.'
    case 2:
      return '📋 리포트 템플릿을 선택해주세요.'
    case 3:
      return '🔗 데이터 소스를 연결해주세요.'
    case 4:
      return '⚙️ 콘텐츠 설정을 완료해주세요.'
    default:
      return '이전 단계를 완료해주세요.'
  }
}

// 단계별 경로를 반환하는 함수
const getStepPath = (stepId: number): string => {
  const paths = {
    1: '/report/basic-info',
    2: '/report/template',
    3: '/report/data-source',
    4: '/report/content',
    5: '/report/preview',
  }
  return paths[stepId as keyof typeof paths] || '/report/basic-info'
}

export default function StepSidebar({ steps, currentStep }: StepSidebarProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({})
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    // 클라이언트 사이드에서만 localStorage 체크
    const stepCompletions: Record<number, boolean> = {}
    steps.forEach((step) => {
      stepCompletions[step.id] = checkStepCompletion(step.id)
    })
    setCompletedSteps(stepCompletions)
  }, [steps])

  return (
    <div className="bg-grayscale-b0 p-4 rounded-[20px] shadow-sm border border-grayscale-b100 w-full">
      <h2 className="text-Pre-16-R text-grayscale-b900 mb-3">생성단계</h2>
      <div className="space-y-3">
        {steps.map((step) => {
          const isActive = step.id === currentStep
          // 클라이언트 사이드에서만 완료 상태 확인
          const isCompleted = isClient ? completedSteps[step.id] : false
          // 접근 가능한지 확인
          const canAccess = isClient ? canAccessStep(step.id, completedSteps) : step.id === 1

          const handleClick = (e: React.MouseEvent) => {
            if (!canAccess) {
              e.preventDefault()

              // 가장 먼저 완료해야 할 단계 찾기
              const firstIncompleteStep = getFirstIncompleteStep(step.id, completedSteps)
              const requiredInfo = getStepRequiredInfo(firstIncompleteStep)
              const stepPath = getStepPath(firstIncompleteStep)

              // 안내 메시지 표시
              alert(`${firstIncompleteStep}단계를 먼저 완료해주세요!\n\n${requiredInfo}`)

              // 해당 단계로 이동
              router.push(stepPath)

              return false
            }
          }

          return (
            <Link
              key={step.id}
              href={canAccess ? step.path : '#'}
              onClick={handleClick}
              className={`flex items-center p-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-[#CFE4FD] text-[#004CA5]'
                  : isCompleted
                    ? 'text-grayscale-b800'
                    : canAccess
                      ? 'text-grayscale-b600 hover:bg-grayscale-b25'
                      : 'text-grayscale-b400 cursor-not-allowed'
              }`}
            >
              <div
                className={`flex items-center justify-center w-11 h-11 rounded-full mr-[14px] ${
                  isActive
                    ? 'bg-[#004CA5] text-white'
                    : isCompleted
                      ? 'bg-[#22CB77] text-white'
                      : canAccess
                        ? 'bg-[#DDDDDD] text-[#000]'
                        : 'bg-[#F5F5F5] text-[#BBBBBB]'
                }`}
              >
                {step.id}
              </div>
              <span className="text-Pre-16-B">{step.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
