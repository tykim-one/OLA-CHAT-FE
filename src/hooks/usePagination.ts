import { useState } from 'react'

interface PaginationData {
  id: string
  [key: string]: any
}

interface PaginationResult<T> {
  currentPages: Record<string, number>
  getPaginatedData: (data: T[], tabKey: string) => T[]
  getTotalPages: (data: T[]) => number
  handlePageChange: (tabKey: string, page: number) => void
}

export const usePagination = <T extends PaginationData>(
  initialPages: Record<string, number>,
  itemsPerPage: number = 12,
): PaginationResult<T> => {
  const [currentPages, setCurrentPages] = useState(initialPages)

  const handlePageChange = (tabKey: string, page: number) => {
    setCurrentPages((prev) => ({ ...prev, [tabKey]: page }))
  }

  const getPaginatedData = (data: T[], tabKey: string) => {
    const currentPage = currentPages[tabKey] || 1
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }

  const getTotalPages = (data: T[]) => {
    return Math.ceil(data.length / itemsPerPage)
  }

  return {
    currentPages,
    getPaginatedData,
    getTotalPages,
    handlePageChange,
  }
}
