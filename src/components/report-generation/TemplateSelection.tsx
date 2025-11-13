// 'use client'

// import React from 'react'

// import SelectionCard from '@/components/shared/SelectionCard'
// import StepNavigationButtons from '@/components/shared/StepNavigationButtons'

// import { useTemplateSelection } from '@/hooks/useTemplateSelection'

// export interface TemplateSelectionProps {
//   onSubmit: (templateId: string) => void
//   initialTemplateId?: string
//   reportType?: string // 이전 단계에서 선택한 리포트 유형
//   onPrevious?: () => void
// }

// export default function TemplateSelection({
//   onSubmit,
//   initialTemplateId,
//   reportType,
//   onPrevious,
// }: TemplateSelectionProps) {
//   const { templates, selectedTemplate, isTemplateDisabled, handleTemplateClick, handleSubmit } =
//     useTemplateSelection({
//       onSubmit,
//       initialTemplateId,
//       reportType,
//     })

//   return (
//     <div className="flex">
//       <div>
//         <div className="ibk-size-16-bold text-[#004CA5] mb-3">템플릿 선택</div>
//         <p className="ibk-size-14-regular text-[#515E6C] mb-3">
//           {reportType
//             ? '선택된 리포트 유형에 맞는 템플릿입니다'
//             : '리포트 유형에 맞는 템플릿을 선택하세요'}
//         </p>

//         <div className="grid grid-cols-2 gap-3 mb-3">
//           {templates.map((template) => (
//             <SelectionCard
//               key={template.id}
//               title={template.title}
//               description={template.description}
//               icon={template.icon}
//               selected={selectedTemplate === template.id}
//               disabled={isTemplateDisabled(template.id)}
//               onClick={() => handleTemplateClick(template.id)}
//             />
//           ))}
//         </div>

//         <StepNavigationButtons
//           nextDisabled={!selectedTemplate}
//           onNext={handleSubmit}
//           onPrevious={onPrevious}
//         />
//       </div>
//     </div>
//   )
// }
