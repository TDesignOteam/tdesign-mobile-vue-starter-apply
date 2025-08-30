<template>
  <!-- 添加加载和未找到状态 -->
  <div v-if="isLoading" class="loading-container">正在加载活动详情...</div>
  <div v-else-if="!activityDetail" class="not-found-container">未找到该活动信息。</div>

  <!-- 仅在成功获取数据后渲染主内容 -->
  <div v-else class="activity-detail" :class="{ 'container-lock': isExpanded }">
    <div class="content-wrapper">
      <!-- 活动封面图 -->
      <div class="cover-image-container">
        <t-image
          class="cover-image"
          fit="cover"
          :src="activityDetail.fullImg || activityDetail.img"
          :style="{ width: '100%', height: '200px' }"
        ></t-image>
      </div>

      <!-- 活动嘉宾轮播 -->
      <div class="swiper-wrapper">
        <h3 class="activity-title">{{ t('pages.activity.activityGuest') }}</h3>
        <div
          v-if="!activityDetail?.guest || activityDetail?.guest?.length === 0"
          class="t-empty"
          style="
            --empty-color: var(--td-bg-color-secondarycomponent);

            color: var(--td-text-color-anti);
          "
        >
          <empty class="t-empty__img" />
          <span style="color: var(--td-text-color-anti)">{{ t('components.empty.text') }}</span>
        </div>
        <div class="swiper-container">
          <t-swiper
            :navigation="{ type: 'dots', placement: 'outside' }"
            :autoplay="false"
            @touchstart="handleTouchPrevent"
            @touchmove="handleTouchPrevent"
            @touchend="handleTouchPrevent"
          >
            <!-- 使用从API获取的嘉宾数据 -->
            <t-swiper-item v-for="guest in activityDetail.guest" :key="guest.name" style="height: 172px">
              <img :src="guest.img" :alt="`嘉宾-${guest.name}`" />
            </t-swiper-item>
          </t-swiper>
        </div>
      </div>

      <!-- 活动会场轮播 -->
      <div class="swiper-wrapper venue-swiper">
        <h3 class="activity-title">{{ t('pages.activity.activityVenue') }}</h3>
        <div
          v-if="!activityDetail?.venue || activityDetail?.venue?.length === 0"
          class="t-empty"
          style="
            --empty-color: var(--td-bg-color-secondarycomponent);

            color: var(--td-text-color-anti);
          "
        >
          <empty class="t-empty__img" />
          <span style="color: var(--td-text-color-anti)">{{ t('components.empty.text') }}</span>
        </div>
        <div class="swiper-container">
          <t-swiper
            :navigation="{ type: 'dots', placement: 'outside' }"
            :autoplay="false"
            @touchstart="handleTouchPrevent"
            @touchmove="handleTouchPrevent"
            @touchend="handleTouchPrevent"
          >
            <!-- 使用从API获取的会场数据 -->
            <t-swiper-item v-for="venue in activityDetail.venue" :key="venue.name" style="height: 172px">
              <img :src="venue.img" :alt="`会场-${venue.name}`" />
            </t-swiper-item>
          </t-swiper>
        </div>
      </div>
    </div>

    <!-- 抽屉 -->
    <div style="position: fixed; bottom: 0; width: 100%">
      <div
        class="bottom-drawer"
        :class="{ 'is-expanded': isExpanded, 'no-transition': isDragging }"
        :style="{ height: `${drawerHeight}px` }"
      >
        <div
          class="drawer-handle"
          :class="{ dragging: isDragging }"
          @mousedown="onDragStart"
          @touchstart.prevent="onDragStart"
        >
          <img src="/assets/image/union.png" alt="弧形装饰" class="drawer-arc-img" :class="{ hide: isExpanded }" />
          <div class="drawer-arrow-container" :class="{ expanded: isExpanded, collapsed: !isExpanded }">
            <chevron-down-icon v-if="isExpanded" class="drawer-arrow-icon" />
            <chevron-up-icon v-else class="drawer-arrow-icon" />
          </div>
        </div>
        <div class="drawer-content" @touchmove="onDrawerTouchMove" @wheel.stop>
          <div class="activity-info-wrapper">
            <div class="container">
              <h1 class="activity-main-title">{{ activityDetail.name }}</h1>

              <div class="interested-section split">
                <t-avatar-group size="small" cascading="left-up" :max="5">
                  <t-avatar
                    v-for="(url, index) in activityInterested"
                    :key="index"
                    shape="circle"
                    :image="url.avatar"
                  ></t-avatar>
                </t-avatar-group>
                <span class="interested-count">
                  {{ activityDetail.interested || 0 }} {{ t('pages.activity.howManyInterested') }}
                </span>
              </div>

              <!-- 时间与地点 -->
              <div class="info-block split">
                <div class="info-row">
                  <time-icon size="20px" />
                  <span>{{ t('pages.activity.time') }}：{{ getDateRangeYMD(activityDetail) }}</span>
                </div>
                <div class="info-row">
                  <location-icon size="20px" />
                  <span>{{ t('pages.activity.place') }}：{{ activityDetail.place || '-' }}</span>
                  <t-button theme="light" size="extra-small" class="nav-button">
                    {{ t('pages.activity.navigationBtn') }}
                  </t-button>
                </div>
              </div>
            </div>

            <!-- 活动评价 -->
            <div class="rating-section">
              <div class="section-header">
                <h2 class="section-title">{{ t('pages.activity.activityComments') }}({{ activityReviews.length }})</h2>
                <div class="rating-display">
                  <t-rate :value="activityDetail.evaluate" size="20" show-text allow-half />
                </div>
              </div>
              <div class="reviews-scroll-container">
                <t-cell
                  v-for="review in activityReviews"
                  :key="review.id"
                  :title="review.user"
                  :description="review.content"
                  :bordered="false"
                  class="review-cell"
                >
                  <template #leftIcon>
                    <t-avatar shape="circle" :image="review.avatar" />
                  </template>
                </t-cell>
              </div>
            </div>

            <!-- 活动介绍 -->
            <div class="intro-section container">
              <div class="section-header">
                <h2 class="section-title">{{ t('pages.activity.activityIntroduction') }}</h2>
              </div>
              <p class="intro-paragraph">{{ activityDetail.introduce || t('pages.activity.emptyIntroduction') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="bottom-bar">
        <div style="display: flex; flex-direction: row">
          <div class="action-item" :class="{ favorited: isFavorited }" @click="handleFavoriteClick">
            <heart-filled-icon v-if="isFavorited" size="24" />
            <heart-icon v-else size="24" />
            <span>{{ isFavorited ? t('pages.activity.liked') : t('pages.activity.like') }}</span>
          </div>
          <div class="action-item" @click="handleShareClick">
            <share-icon size="24" />
            <span>{{ t('pages.activity.share') }}</span>
          </div>
        </div>
        <t-button theme="primary" shape="rectangle" class="buy-button" @click="handleBuyClick">{{
          formattedPrice
        }}</t-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ChevronDownIcon,
  ChevronUpIcon,
  HeartFilledIcon,
  HeartIcon,
  LocationIcon,
  ShareIcon,
  TimeIcon,
} from 'tdesign-icons-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getActivityEvaluate, getActivityInterestedPeople, getAllActivityList } from '@/api/list';
import type { ActivityEvaluate, ActivityInterestedPeopleData, ActivityModel } from '@/api/model/listModel';
import Empty from '@/components/result/Empty';
import { t } from '@/locales';
import { useResultStore } from '@/store';
import { getDateRangeYMD } from '@/utils/activity/getDate';
import { getMaxPrice, getMinPrice } from '@/utils/activity/getPrice';

const isLoading = ref(true);
const activityDetail = ref<ActivityModel>(null);
const activityReviews = ref<ActivityEvaluate[]>([]);
const activityInterested = ref<ActivityInterestedPeopleData[]>([]);
const route = useRoute();
const router = useRouter();
const resultStore = useResultStore();

onMounted(async () => {
  // 从路由参数中获取活动ID (例如 /activity/2 -> id = 2)
  const activityId = Number(route.params.id);

  if (!activityId) {
    isLoading.value = false;
    console.error('未能在路由中找到有效的活动ID');
    return;
  }

  try {
    // 异步请求所有活动列表和评价列表
    const [activityRes, evaluateRes, interestedRes] = await Promise.all([
      getAllActivityList(),
      getActivityEvaluate(),
      getActivityInterestedPeople(),
    ]);

    // 在所有活动中查找与当前ID匹配的活动
    const foundActivity = activityRes.list.find((act) => act.id === activityId);

    if (foundActivity) {
      activityDetail.value = foundActivity;
      activityReviews.value = evaluateRes.list;
      activityInterested.value = interestedRes;
      document.title = foundActivity.name; // 动态设置页面标题
    } else {
      console.error(`ID为 ${activityId} 的活动未找到`);
    }
  } catch (error) {
    console.error('获取活动详情失败:', error);
  } finally {
    isLoading.value = false; // 加载结束
  }
});

const formattedPrice = computed(() => {
  const price = activityDetail.value?.price;
  if (!price) return '立即购买';
  if (price === 'free') return '免费参与';

  const minPrice = getMinPrice(activityDetail.value);
  const maxPrice = getMaxPrice(activityDetail.value);
  if (minPrice === maxPrice) return `立即购买 ¥${minPrice}`;
  return `立即购买 ¥${minPrice}-¥${maxPrice}`;
});

// --- 底部操作栏逻辑  ---
const isFavorited = ref(false);
const handleFavoriteClick = () => {
  isFavorited.value = !isFavorited.value;
};
const handleShareClick = () => console.log('触发分享');
const handleBuyClick = () => {
  resultStore.setActivity(activityDetail.value);
  router.push({ path: '/order/confirm' });
};

// --- 抽屉交互逻辑  ---
const MIN_DRAWER_HEIGHT = 20;
const MAX_DRAWER_HEIGHT = window.innerHeight * 0.6;
const drawerHeight = ref(MAX_DRAWER_HEIGHT);
const SNAP_THRESHOLD = (MIN_DRAWER_HEIGHT + MAX_DRAWER_HEIGHT) / 2;
const isExpanded = computed(() => drawerHeight.value > MIN_DRAWER_HEIGHT);
const isDragging = ref(false);
let startY = 0;
let startHeight = 0;
let movedDistance = 0;
const CLICK_DRAG_THRESHOLD = 5;
const getClientY = (e: MouseEvent | TouchEvent) => ('touches' in e ? e.touches[0].clientY : e.clientY);
const toggleDrawer = () => {
  drawerHeight.value = isExpanded.value ? MIN_DRAWER_HEIGHT : MAX_DRAWER_HEIGHT;
};
const onDragStart = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true;
  startY = getClientY(e);
  startHeight = drawerHeight.value;
  movedDistance = 0;
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('touchend', onDragEnd);
};
const onDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  const currentY = getClientY(e);
  const delta = startY - currentY;
  movedDistance = Math.max(movedDistance, Math.abs(delta));
  let next = startHeight + delta;
  next = Math.max(MIN_DRAWER_HEIGHT, Math.min(next, MAX_DRAWER_HEIGHT));
  drawerHeight.value = next;
  if ('touches' in e) e.preventDefault();
};
const onDragEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  if (movedDistance < CLICK_DRAG_THRESHOLD) {
    toggleDrawer();
  } else {
    drawerHeight.value = drawerHeight.value >= SNAP_THRESHOLD ? MAX_DRAWER_HEIGHT : MIN_DRAWER_HEIGHT;
  }
  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);
  window.removeEventListener('touchmove', onDragMove);
  window.removeEventListener('touchend', onDragEnd);
};
let lastDrawerTouchY: number | undefined;
const onDrawerTouchMove = (e: TouchEvent) => {
  const target = e.currentTarget as HTMLElement;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const offsetHeight = target.offsetHeight;
  const direction = e.touches[0].clientY - (lastDrawerTouchY ?? e.touches[0].clientY);
  lastDrawerTouchY = e.touches[0].clientY;
  if ((scrollTop === 0 && direction > 0) || (scrollTop + offsetHeight >= scrollHeight && direction < 0)) {
    e.preventDefault();
    e.stopPropagation();
  } else {
    e.stopPropagation();
  }
};

// 防止页面晃动的触摸事件处理
const handleTouchPrevent = (e: TouchEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
</script>
<style lang="less" scoped>
@import './index.less';

/* 新增的加载和未找到样式 */
.loading-container,
.not-found-container {
  display: flex;
  justify-content: center;
  padding: 96px 0;
  font-size: 16px;
  color: var(--td-text-color-secondary);
}
</style>
