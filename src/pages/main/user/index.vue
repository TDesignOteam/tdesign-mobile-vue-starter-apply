<script setup lang="ts">
import type { UserProfile } from '@/api/userInfo'
import { getPersonActivities } from '@/api/activity'
import { getUserProfile } from '@/api/userInfo'
import { formatDate } from '@/utils/date'
import ActivityCard from '../components/ActivityCard.vue'
import ActivityCardSkeleton from '../components/ActivityCardSkeleton.vue'

/** Tab 页签值类型 */
type TabValue = 'first' | 'second' | 'third'

/** 活动状态类型 */
type ActivityStatus = '待参加' | '已完成'

/** 活动列表项数据结构 */
interface ActivityItem {
  /** 活动 ID */
  id: string
  /** 活动封面图 */
  cover: string
  /** 活动标题 */
  title: string
  /** 格式化后的时间 */
  time: string
  /** 活动状态 */
  status: ActivityStatus
}

/** 当前选中的 Tab 页签 */
const tabValue = ref<TabValue>('first')

/** 活动列表数据 */
const activities = ref<ActivityItem[]>([])

/** 活动列表加载状态 */
const isFetching = ref<boolean>(false)

/** 用户个人资料数据 */
const profile = ref<UserProfile | null>(null)

/** 个人资料加载状态 */
const isProfileLoading = ref<boolean>(false)

/**
 * 将 Tab 页签值映射为对应的活动状态
 * @param tab Tab 页签值
 * @returns 对应的活动状态，如果是 "全部活动" 则返回 undefined
 */
function mapTabToStatus(tab: TabValue): ActivityStatus | undefined {
  if (tab === 'first')
    return '待参加'
  if (tab === 'second')
    return '已完成'
  // 'third' 对应全部活动，不过滤状态
  return undefined
}

/** 获取用户活动列表数据 */
async function fetchActivities(): Promise<void> {
  isFetching.value = true
  try {
    const status = mapTabToStatus(tabValue.value)
    const response = await getPersonActivities({
      page: 1,
      pageSize: 20,
      status,
    })

    // 确保数据格式正确
    const pageData = Array.isArray(response.data) ? response.data : []

    // 转换数据格式以适配组件需求
    activities.value = pageData.map(item => ({
      id: String(item.id),
      cover: item.cover,
      title: item.title,
      time: formatDate(item.date),
      status: item.status,
    }))
  }
  catch (error) {
    // 请求失败时清空列表
    activities.value = []
    console.error('获取活动列表失败:', error)
  }
  finally {
    isFetching.value = false
  }
}

/** 获取用户个人资料数据 */
async function fetchProfile(): Promise<void> {
  isProfileLoading.value = true
  try {
    const response = await getUserProfile()
    profile.value = response
  }
  catch (error) {
    console.error('获取用户资料失败:', error)
  }
  finally {
    isProfileLoading.value = false
  }
}

/** 处理个人信息编辑按钮点击事件 */
function onEdit(): void {
  // TODO: 跳转到个人信息编辑页面
}

/**
 * 处理活动评价按钮点击事件
 * @param id 活动 ID
 */
function onReview(id: string): void {
  // TODO: 跳转到活动评价页面
  console.log('评价活动:', id)
}

/**
 * 处理 Tab 页签切换事件
 * @param value 新的页签值
 */
function onTabChange(value: string | number): void {
  tabValue.value = String(value) as TabValue
  // 切换页签时重新获取对应的活动列表
  fetchActivities()
}

onMounted(() => {
  // 获取数据
  fetchActivities()
  fetchProfile()
})
</script>

<template>
  <div class="user-page">
    <div class="user-card">
      <div class="user-card__info">
        <div class="user-card__avatar">
          <t-skeleton :loading="isProfileLoading && !profile" animation="flashed" :row-col="[{ height: '64px', width: '64px', type: 'circle' }]" />
          <t-avatar v-if="!isProfileLoading" :image="profile?.avatar || 'https://tdesign.gtimg.com/mobile/demos/avatar1.png'" alt="用户头像" size="large" />
        </div>
        <div class="user-card__meta">
          <t-skeleton
            :loading="isProfileLoading && !profile" animation="flashed"
            style="--td-skeleton-row-spacing: 8px"
            :row-col="[{ height: '24px', width: '48px' }, [{ height: '24px', width: '43px' }, { height: '24px', width: '106px', marginLeft: '8px' }]]"
          />
          <div v-if="profile">
            <div class="user-card__name">
              {{ profile.name }}
            </div>
            <div class="user-card__tag">
              <t-tag variant="light">
                {{ profile.age }}岁
              </t-tag>
              <t-tag variant="light">
                {{ profile.occupation }}
              </t-tag>
            </div>
          </div>
        </div>
      </div>
      <button
        class="user-card__edit"
        type="button"
        aria-label="编辑个人信息"
        @click="onEdit"
      >
        <EditIcon size="20px" />
      </button>
    </div>
    <div class="activity-list">
      <div class="tab-wrapper">
        <t-tabs :value="tabValue" @change="onTabChange">
          <t-tab-panel
            value="first"
            :badge-props="{ dot: true, offset: [-4, 1] }"
            label="待参加"
          />
          <t-tab-panel value="second" label="已完成" />
          <t-tab-panel value="third" label="全部活动" />
        </t-tabs>
      </div>
      <div class="activity-list__content">
        <ActivityCardSkeleton v-if="isFetching && activities.length === 0" :count="1">
          <t-skeleton
            animation="flashed"
            :loading="true"
            style="margin-bottom: 4px"
            :row-col="[{ height: '22px', width: '100%' }]"
          />
          <t-skeleton
            animation="flashed"
            :loading="true"
            :row-col="[{ height: '20px', width: '90px' }]"
          />
          <t-skeleton
            animation="flashed"
            :loading="true"
            :row-col="[{ height: '22px', width: '42px' }]"
            style="margin-top: auto;"
          />
        </ActivityCardSkeleton>
        <t-empty v-if="!isFetching && activities.length === 0" description="暂无活动" />
        <div v-for="item in activities" :key="item.id" class="activity-item">
          <ActivityCard :cover="item.cover" :title="item.title">
            <template #content>
              <div class="activity-item__time">
                {{ item.time }}
              </div>
            </template>
            <template #footer>
              <div class="activity-item__footer">
                <div
                  class="activity-item__status"
                  :style="{ color: item.status === '已完成' ? 'var(--td-font-gray-3)' : 'var(--td-success-color-5)' }"
                >
                  {{ item.status }}
                </div>
                <button
                  v-if="item.status === '已完成'"
                  class="activity-item__btn"
                  type="button"
                  aria-label="去评价"
                  @click="onReview(item.id)"
                >
                  去评价
                </button>
              </div>
            </template>
          </ActivityCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import './index.less';
</style>
