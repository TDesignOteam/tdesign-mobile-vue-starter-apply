<script setup lang="ts">
import type { ActivityDetail } from '@/api/activity'
import { getActivityDetail } from '@/api/activity'
import ActivitySwiper from '@/components/ActivitySwiper.vue'
import { isExpired } from '@/utils/date'
import Popup from './components/Popup.vue'

const route = useRoute()
const router = useRouter()

/** 活动 ID */
const activityId = computed<string>(() => String((route.params as { id: string }).id))

/** 活动详情数据 */
const detail = ref<ActivityDetail | null>(null)

/** 底部弹层显示状态 */
const showBottomPopup = ref<boolean>(true)

/** Popup弹层高度 */
const popupHeight = computed<string>(() => (showBottomPopup.value ? '80vh' : '91px'))

/** 顶部横幅图片 */
const bannerUrl = computed<string | undefined>(() => detail.value?.banner)

/** 嘉宾图片列表 */
const guestImages = computed<string[]>(() => detail.value?.guestImages ?? [])

/** 现场图片列表 */
const sceneImages = computed<string[]>(() => detail.value?.sceneImages ?? [])

/** 构造嘉宾轮播组件数据格式 */
const guestSwiperList = computed(() =>
  guestImages.value.map((url, index) => ({
    id: String(index),
    name: `活动嘉宾图片${index + 1}`,
    url,
  })),
)

/** 构造现场轮播组件数据格式 */
const sceneSwiperList = computed(() =>
  sceneImages.value.map((url, index) => ({
    id: String(index),
    name: `活动现场图片${index + 1}`,
    url,
  })),
)

/** 价格显示文案 */
const priceText = computed<string>(() => {
  if (!detail.value)
    return ''

  const min = detail.value.minPrice ?? 0
  const max = detail.value.maxPrice ?? 0

  if (min === 0 && max === 0)
    return '免费'
  if (min === max)
    return `¥${min}`
  return `¥${min}-¥${max}`
})

/** 活动是否已结束 */
const isEnded = computed<boolean>(() => {
  if (!detail.value?.date)
    return false
  return isExpired(detail.value.date)
})

/** 切换底部弹层展开/收起状态 */
function controlPopup(): void {
  showBottomPopup.value = !showBottomPopup.value
}

/** 获取活动详情数据 */
async function fetchData(): Promise<void> {
  try {
    const data = await getActivityDetail(activityId.value)
    detail.value = data
  }
  catch {
    // 请求失败时跳转到 404 页面
    await router.push('/not-found')
  }
}

/** 处理购买按钮点击事件 */
function handleBuyClick(): void {
  if (isEnded.value)
    // 活动已结束，无响应
    return
  // 跳转至购买确认页
  router.push(`/buy-confirm/${activityId.value}`)
}

onMounted(() => {
  // 加载页面数据
  fetchData()
})
</script>

<template>
  <header>
    <t-navbar
      title="详情"
      left-arrow
      :on-left-click="$router.back"
      class="ad-navbar"
    />
  </header>
  <main class="ad-main">
    <div class="ad-banner">
      <t-skeleton
        v-if="!detail"
        :loading="true"
        :row-col="[{ width: '100%', height: '160px' }]"
      />
      <t-image
        v-else
        :src="bannerUrl" alt="活动横幅" loading="lazy" fit="cover"
        :style="{ width: '100%', height: '160px' }"
        class="ad-banner__image"
      />
    </div>
    <div v-if="guestImages.length" class="ad-section">
      <div class="ad-section__title">
        活动嘉宾
      </div>
      <div class="ad-section__swiper">
        <ActivitySwiper
          :swiper-list="guestSwiperList"
          :autoplay="false"
          margin-position="right"
          :swiper-gap="28"
        />
      </div>
    </div>
    <div v-if="sceneImages.length" class="ad-section">
      <div class="ad-section__title">
        活动现场
      </div>
      <div class="ad-section__swiper">
        <ActivitySwiper
          :swiper-list="sceneSwiperList"
          :autoplay="false"
          margin-position="right"
          :swiper-gap="28"
        />
      </div>
    </div>
  </main>
  <footer>
    <div class="ad-footer-actions">
      <div class="ad-footer-action">
        <HeartIcon size="20px" />
        <div class="ad-footer-action__text">
          收藏
        </div>
      </div>
      <div class="ad-footer-action">
        <ShareIcon size="20px" />
        <div class="ad-footer-action__text">
          分享
        </div>
      </div>
    </div>
    <div class="ad-footer-cta">
      <t-button v-if="!isEnded" size="large" theme="primary" block @click="handleBuyClick">
        {{ `立即购买 ${priceText}` }}
      </t-button>
      <t-button v-else size="large" theme="primary" block disabled>
        已下架
      </t-button>
    </div>
  </footer>
  <Popup
    :detail="detail"
    :show-bottom-popup="showBottomPopup"
    :popup-height="popupHeight"
    @toggle="controlPopup"
  />
</template>

<style lang="less" scoped>
@import './index.less';
</style>
