'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

// 경로별 한국어 제목 매핑
const PAGE_TITLES: Record<string, string> = {
  '': '메인',
  report: '리포트',
  'basic-info': '기본정보',
  template: '템플릿 선택',
  'data-source': '데이터소스 연결',
  content: '콘텐츠 설정',
  preview: '미리보기 및 생성',
  completed: '리포트 생성완료',
  login: '로그인',
}

interface BreadCrumbItem {
  title: string
  path: string
  isActive: boolean
}

interface BreadCrumbProps {
  customTitle?: string // 동적 제목을 위한 prop (예: 리포트 제목)
  showHome?: boolean // 홈 링크 표시 여부
  className?: string
}

export default function BreadCrumb({
  customTitle,
  showHome = true,
  className = '',
}: BreadCrumbProps) {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadCrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadCrumbItem[] = []

    // 홈 항목 추가
    if (showHome) {
      breadcrumbs.push({
        title: PAGE_TITLES[''],
        path: '/',
        isActive: pathname === '/',
      })
    }

    // 리포트 생성 단계들 (기본정보 ~ 미리보기)
    const reportGenerationSteps = ['basic-info', 'template', 'data-source', 'content', 'preview']

    if (paths.length >= 1 && paths[0] === 'report') {
      if (paths.length === 1) {
        // /report 경로: 홈 > 리포트 생성
        breadcrumbs.push({
          title: '리포트 생성',
          path: pathname,
          isActive: true,
        })
      } else if (paths.length >= 2) {
        const reportStep = paths[1]

        if (reportGenerationSteps.includes(reportStep)) {
          // 기본정보 ~ 미리보기 단계: 홈 > 리포트 생성 (중간 단계 제거)
          breadcrumbs.push({
            title: '리포트 생성',
            path: pathname,
            isActive: true,
          })
        } else if (reportStep === 'completed') {
          // 생성완료 단계: 홈 > 리포트 생성완료 또는 홈 > [리포트 제목]
          if (paths.length >= 3 && customTitle) {
            // 동적 경로 (/report/completed/[id])이고 customTitle이 있는 경우
            breadcrumbs.push({
              title: customTitle,
              path: pathname,
              isActive: true,
            })
          } else {
            // 일반 완료 페이지 (/report/completed)인 경우
            breadcrumbs.push({
              title: '리포트 생성완료',
              path: pathname,
              isActive: true,
            })
          }
        }
      }
    } else {
      // 다른 경로들은 기존 방식 유지
      let currentPath = ''
      paths.forEach((path, index) => {
        currentPath += `/${path}`
        const isLast = index === paths.length - 1

        breadcrumbs.push({
          title: PAGE_TITLES[path] || path,
          path: currentPath,
          isActive: isLast,
        })
      })
    }

    // customTitle이 있고 마지막 항목이 활성상태인 경우 제목 업데이트
    if (customTitle && breadcrumbs.length > 0) {
      const lastItem = breadcrumbs[breadcrumbs.length - 1]
      if (lastItem.isActive) {
        lastItem.title = customTitle
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`}>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <span className="text-gray-400 mx-2">
              <svg
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L1 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}

          {item.isActive ? (
            <span>{item.title}</span>
          ) : (
            <Link href={item.path} className="text-gray-500 hover:text-gray-700 transition-colors">
              {item.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// 특정 보고서 단계를 위한 전용 BreadCrumb 컴포넌트
export function ReportBreadCrumb() {
  // 모든 생성 단계에서 동일하게 "리포트 생성" 표시
  // 추후 생성완료 단계(/report/completed)에서는 자동으로 3depth로 표시됨
  return <BreadCrumb className="mb-2" />
}
