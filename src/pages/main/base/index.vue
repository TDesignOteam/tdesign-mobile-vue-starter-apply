<script setup lang="ts">
import type { SortOption } from '@/api/activity'
import { useActivities } from '@/hooks/useActivities'
import { useHomeSwiper } from '@/hooks/useHomeSwiper'
import ActivityCard from '../components/ActivityCard.vue'
import ActivityCardSkeleton from '../components/ActivityCardSkeleton.vue'
import ActivityFilterPopup from './components/ActivityFilterPopup.vue'

defineOptions({
  name: 'MainIndex',
})

// 定义 Tab 面板接口，包含值和标签
interface TabPanel {
  value: SortOption
  label: string
}

// Tab 面板的配置
const tabPanels: TabPanel[] = [
  {
    value: 'latest',
    label: '最新活动',
  },
  {
    value: 'top',
    label: '高分活动',
  },
]

const offsetHeight = 104 // 顶部固定栏（navbar+搜索框）的高度
const searchValue = ref('') // 搜索框的值
const pageContainerRef = ref<any | null>(null) // 页面容器的引用，用于控制滚动位置
const scrollPosition = ref(0) // 记录组件失活时的滚动位置
const lastKnownScrollPosition = ref(0) // 记录上一次的滚动位置
const swiperReady = ref(false) // 用于控制轮播图的渲染时机，让其在 DOM 真正准备好之后再出现
const filterPopupVisible = ref(false) // 筛选弹窗是否可见

const {
  swiperList, // 轮播图列表
  isFetchSwiperList, // 是否正在获取轮播图列表
  fetchSwiperList, // 获取轮播图列表
} = useHomeSwiper()

const {
  isRefresh, // 是否处于刷新页面状态
  isFetchActivityList, // 是否正在获取活动列表
  isLoadAllActivities, // 是否已加载所有活动
  filters, // 筛选器
  currentTab, // 当前选中的 Tab
  activityList, // 活动列表
  fetchActivityList, // 获取活动列表
  resetFilters, // 重置筛选器
  handleFiltersUpdate, // 处理筛选器更新事件
} = useActivities()

/**
 * 重置筛选器并重新获取活动列表
 */
function resetAndFetch() {
  resetFilters()
  fetchActivityList()
  filterPopupVisible.value = false
}

/**
 * 处理滚动事件，在触底时触发加载更多。
 * @param scrollBottom 距离底部的距离
 * @param scrollTop 距离顶部的距离
 */
function onScroll(scrollBottom: number, scrollTop: number) {
  lastKnownScrollPosition.value = scrollTop
  if (!isFetchActivityList.value && !isLoadAllActivities.value && scrollBottom < 56) {
    fetchActivityList(false)
  }
}

// 组件挂载后，获取轮播图和活动列表
onMounted(() => {
  fetchSwiperList()
  fetchActivityList()
})

// 当页面被 keep-alive 缓存时，组件进入失活状态
onDeactivated(() => {
  swiperReady.value = false // 提前隐藏轮播图，避免在页面被缓存期间，因 DOM 仍在内存中但未正确渲染导致的视觉问题
  scrollPosition.value = lastKnownScrollPosition.value // 记录离开页面时的滚动位置
})

// 当页面被 keep-alive 重新激活时
onActivated(() => {
  nextTick(() => {
    swiperReady.value = true
    // 恢复之前的滚动位置
    if (scrollPosition.value > 0) {
      if (pageContainerRef.value) {
        let scrollTop = 0
        if (scrollPosition.value < offsetHeight)
          scrollTop = scrollPosition.value
        else scrollTop = scrollPosition.value - offsetHeight
        pageContainerRef.value.scrollTop = scrollTop
      }
    }
  })
})
</script>

<template>
  <div ref="pageContainerRef" class="page-container">
    <t-sticky :offset-top="48" :z-index="99">
      <div class="search-container">
        <t-search
          v-model="searchValue"
          :clearable="true"
          shape="round"
          placeholder="搜索活动"
        />
      </div>
    </t-sticky>

    <div>
      <h2>热门推荐</h2>
      <ActivitySwiper
        :is-fetch-swiper-list
        :swiper-ready
        :swiper-list="swiperList"
      />
    </div>

    <div>
      <h2 style="padding-bottom: 0">
        全部活动
      </h2>
      <t-sticky :offset-top="offsetHeight" :z-index="99">
        <div class="tab-container">
          <t-tabs
            v-model:value="currentTab"
            :split="false"
            :show-bottom-line="false"
            @change="fetchActivityList()"
          >
            <t-tab-panel
              v-for="(item, index) in tabPanels"
              :key="`tab-${index}`"
              :value="item.value"
              :label="item.label"
            />
          </t-tabs>
          <div
            class="tab-container__filter"
            @click="filterPopupVisible = true"
          >
            <FilterIcon size="16" />
            <span style="margin-left: 2px;">筛选</span>
          </div>
        </div>
      </t-sticky>
    </div>

    <t-divider style="margin: 0" />
    <div
      v-if="!isFetchActivityList && activityList.length === 0"
      key="empty"
      class="empty-result-container slide-in-animation"
    >
      <t-result>
        <template #image>
          <t-image src="https://tdesign.gtimg.com/mobile/demos/result1.png" />
        </template>
        <template #title>
          <div style="font-size: large">
            暂无相关活动
          </div>
        </template>
        <template #description>
          <div>换个筛选条件试试，或许有惊喜哦～</div>
        </template>
      </t-result>
    </div>
    <div
      v-else-if="isFetchActivityList && isRefresh"
      key="skeleton"
      class="card-container"
    >
      <ActivityCardSkeleton />
    </div>

    <t-list v-else @scroll="onScroll">
      <template #footer>
        <div v-if="isLoadAllActivities" class="no-more-activity">
          没有更多活动了哦～
        </div>
      </template>
      <router-link
        v-for="item in activityList"
        :key="item.id"
        :to="`/activity-detail/${item.id}`"
      >
        <ActivityCard :cover="item.cover" :title="item.title">
          <template #content>
            <div class="rate-container">
              <t-rate
                v-model="item.score"
                size="16"
                variant="filled"
                allow-half
                disabled
              />
              <span>{{ item.score }}分</span>
            </div>
          </template>
          <template #footer>
            <span class="price">{{
              item.formattedPrice
            }}</span>
          </template>
        </ActivityCard>
      </router-link>
      <div v-if="!isRefresh && isFetchActivityList" key="skeleton-more">
        <ActivityCardSkeleton :count="1" />
      </div>
    </t-list>

    <ActivityFilterPopup
      v-model:visible="filterPopupVisible"
      :filters
      @reset="resetAndFetch"
      @update:filters="handleFiltersUpdate"
    />
  </div>
</template>

<style scoped lang="less">
@import './index.less';
</style>
