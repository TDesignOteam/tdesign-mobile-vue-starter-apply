import type { ActivityFilterParams as Filters, SortOption } from '@/api/activity'
import { getActivities } from '@/api/activity'
import { formatPrice } from '@/utils/formatters'
import { useFilters } from './useFilters'

// 定义活动接口，包含ID、标题、封面图片、评分和格式化后的价格
interface Activity {
  id: number
  title: string
  cover: string
  score: number
  formattedPrice?: string
}

export function useActivities() {
  const currentTab = ref<SortOption>('latest') // 当前选中的 Tab，默认为最新活动
  const isRefresh = ref(true) // 是否处于刷新页面状态
  const isFetchActivityList = ref(true) // 是否正在获取活动列表
  const isLoadAllActivities = ref(false) // 是否已加载所有活动
  const activityList = ref<Activity[]>([]) // 活动列表
  const pageSize = 10 // 每次加载（每页显示）的活动数量
  let currentPage = 1 // 当前页码

  const { filters, resetFilters } = useFilters() // 使用自定义 Hook 来管理筛选器状态

  /**
   * 处理 API 返回的活动数据，并格式化价格
   * @param res API 响应数据
   * @returns 格式化后的活动数组
   */
  function processActivityResponse(res: any): Activity[] {
    if (!res || !res.data || !res.data.paginatedData) {
      throw new Error('API response format is invalid')
    }
    return res.data.paginatedData.map((item: any) => ({
      ...item,
      formattedPrice: formatPrice(item.minPrice, item.maxPrice),
    }))
  }

  /**
   * 获取活动列表
   * @param isRefreshMode 是否为刷新模式（默认为 true）
   */
  async function fetchActivityList(isRefreshMode = true) {
    if (isLoadAllActivities.value && !isRefreshMode) {
      return
    }
    isRefresh.value = isRefreshMode
    isFetchActivityList.value = true
    if (isRefresh.value) {
      currentPage = 1 // 刷新模式下，重置页码
      isLoadAllActivities.value = false // 重置加载状态
    }
    try {
      const payload = {
        sort: currentTab.value,
        page: currentPage,
        pageSize,
        domain: filters.domain,
        type: filters.type,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        dateRange: filters.dateRange,
      }
      const res = await getActivities(payload)
      const paginatedData = processActivityResponse(res)
      if (isRefresh.value) {
        activityList.value = paginatedData
      }
      else {
        activityList.value.push(...paginatedData)
      }
      if (paginatedData.length < pageSize) {
        isLoadAllActivities.value = true
      }
      else {
        currentPage++
      }
    }
    catch (error) {
      console.error('获取活动列表失败:', error)
    }
    finally {
      isFetchActivityList.value = false
    }
  }

  /**
   * 处理筛选器更新事件
   * @param newFilters 新的筛选器值
   */
  function handleFiltersUpdate(newFilters: Filters) {
    Object.assign(filters, newFilters)
    fetchActivityList()
  }

  return {
    isRefresh,
    isFetchActivityList,
    isLoadAllActivities,
    filters,
    currentTab,
    activityList,
    fetchActivityList,
    resetFilters,
    handleFiltersUpdate,
  }
}
