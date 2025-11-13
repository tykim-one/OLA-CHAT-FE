'use client'

import React from 'react'

import { cn } from '@/lib/utils'

interface TabsProps {
  defaultValue?: string
  className?: string
  children: React.ReactNode
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

interface TabsTriggerProps {
  value: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
  isActive?: boolean
}

interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
  isActive?: boolean
}

const TabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
}>({
  activeTab: '',
  setActiveTab: () => {},
})

const Tabs: React.FC<TabsProps> = ({ defaultValue = '', className, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-t-3xl bg-white border border-gray-200 border-b-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children, onClick }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)
  const isActive = activeTab === value

  const handleClick = () => {
    setActiveTab(value)
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium transition-all',
        'hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
        isActive ? 'text-gray-900 border-b-2 border-Finola-Blue' : 'text-gray-600',
        className,
      )}
    >
      {children}
    </button>
  )
}

const TabsContent: React.FC<TabsContentProps> = ({ value, className, children }) => {
  const { activeTab } = React.useContext(TabsContext)
  const isActive = activeTab === value

  if (!isActive) return null

  return <div className={cn('mt-2', className)}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
