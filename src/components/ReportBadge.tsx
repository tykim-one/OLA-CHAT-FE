'use client'

import React from 'react'

import { BrainCircuit, DollarSign, HandCoins, Sun } from 'lucide-react'

import { cn } from '@/lib/utils'

export type ReportCategory = 'general' | 'currency' | 'dividend' | 'ai'

interface ReportBadgeProps {
  category: ReportCategory
  className?: string
}

const getBadgeConfig = (category: ReportCategory) => {
  switch (category) {
    case 'general':
      return {
        icon: Sun,
        text: '시장',
        bgColor: 'bg-pink-50',
        iconColor: 'text-pink-500',
        textColor: 'text-pink-500',
      }
    case 'currency':
      return {
        icon: DollarSign,
        text: '환율',
        bgColor: 'bg-teal-50',
        iconColor: 'text-teal-500',
        textColor: 'text-teal-500',
      }
    case 'dividend':
      return {
        icon: HandCoins,
        text: '배당',
        bgColor: 'bg-violet-50',
        iconColor: 'text-violet-500',
        textColor: 'text-violet-500',
      }
    case 'ai':
      return {
        icon: BrainCircuit,
        text: 'AI',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-500',
        textColor: 'text-blue-500',
      }
    default:
      return {
        icon: Sun,
        text: '시장',
        bgColor: 'bg-pink-50',
        iconColor: 'text-pink-500',
        textColor: 'text-pink-500',
      }
  }
}

const ReportBadge: React.FC<ReportBadgeProps> = ({ category, className }) => {
  const config = getBadgeConfig(category)
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold w-fit h-5 justify-center',
        config.bgColor,
        className,
      )}
    >
      <Icon className={cn('w-3 h-3', config.iconColor)} />
      <span className={config.textColor}>{config.text}</span>
    </div>
  )
}

export default ReportBadge
