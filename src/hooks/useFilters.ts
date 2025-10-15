import type { ActivityFilterParams as Filters } from '@/api/activity'
import { defaultFilterOptions } from '@/constant/filters'

/**
 * 创建并返回一个包含初始筛选设置的对象
 * @returns 一个包含默认筛选器值的对象
 */
function createInitialFilters(): Filters {
  return {
    domain: [],
    type: [],
    minPrice: defaultFilterOptions.minPrice,
    maxPrice: defaultFilterOptions.maxPrice,
    dateRange: defaultFilterOptions.dateRange.map((d: Date) => new Date(d)),
  }
}

/**
 * 创建给定筛选器对象的深拷贝
 * @param filters 要复制的筛选器对象
 * @returns 一个新的、独立的筛选器对象副本
 */
export function copyFilters(filters: Filters): Filters {
  return {
    ...filters,
    domain: [...filters.domain],
    type: [...filters.type],
    dateRange: filters.dateRange.map((d: Date) => new Date(d)),
  }
}

export function useFilters() {
  const initialValues = createInitialFilters()
  const filters = reactive<Filters>(initialValues)

  const resetFilters = () => {
    const clonedInitialValues = createInitialFilters()
    Object.assign(filters, clonedInitialValues)
  }

  return {
    filters,
    resetFilters,
  }
}
