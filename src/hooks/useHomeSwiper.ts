import { getHomeSwiper } from '@/api/activity'

export function useHomeSwiper() {
  const swiperList = ref([]) // 轮播图列表
  const isFetchSwiperList = ref(true) // 是否正在获取轮播图列表

  /**
   * 获取轮播图列表
   */
  async function fetchSwiperList() {
    try {
      const res = await getHomeSwiper()
      if (!res || !res.data) {
        throw new Error('API response data is undefined')
      }
      swiperList.value = res.data
    }
    catch (error) {
      console.error('获取轮播图列表失败:', error)
    }
    finally {
      isFetchSwiperList.value = false
    }
  }

  return {
    swiperList,
    isFetchSwiperList,
    fetchSwiperList,
  }
}
