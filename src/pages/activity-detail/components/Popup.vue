<script setup lang="ts">
import type { ActivityDetail } from '@/api/activity'
import { formatDate } from '@/utils/date'

interface Props {
  /** 活动详情数据 */
  detail?: ActivityDetail | null
  /** 底部弹层显示状态 */
  showBottomPopup?: boolean
  /** 弹层高度 */
  popupHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  detail: null,
  showBottomPopup: false,
  popupHeight: '80vh',
})

const emit = defineEmits<{
  /** 切换弹层展开/收起状态 */
  toggle: []
}>()

/** 处理弹层切换事件 */
function onToggle(): void {
  emit('toggle')
}

/** 感兴趣用户头像列表 */
const avatarList = computed<string[]>(() =>
  (props.detail?.interestedPeople ?? [])
    .map((person: any) => person.avatar),
)

/** 感兴趣人数 */
const interestedCount = computed<number>(() => props.detail?.interestedCount ?? 0)

/** 活动标题 */
const title = computed<string>(() => props.detail?.title ?? '')

/** 活动地址 */
const address = computed<string>(() => props.detail?.address ?? '')

/** 活动介绍 */
const introduce = computed<string>(() => props.detail?.introduce ?? '')

/** 格式化后的活动日期 */
const dateText = computed<string>(() => {
  const date = props.detail?.date
  return date ? formatDate(date as string | number | Date) : ''
})

/** 活动评分 */
const star = computed<number>(() => props.detail?.score ?? 0)
</script>

<template>
  <t-popup
    :visible="true"
    placement="bottom"
    :show-overlay="false"
    class="ad-popup-wrapper"
    :style="{ height: popupHeight }"
  >
    <div class="ad-popup">
      <div v-show="!showBottomPopup" class="ad-popup__handle" @click="onToggle" />
      <div class="ad-popup__toggle" :class="{ 'ad-popup__toggle--active': showBottomPopup }" @click="onToggle">
        <ChevronUpIcon size="20px" />
      </div>
      <div v-show="showBottomPopup" class="ad-popup__content">
        <template v-if="detail">
          <div class="ad-summary">
            <div class="ad-summary__title">
              {{ title }}
            </div>
            <div class="ad-summary__avatars">
              <t-avatar-group cascading="right-up" :max="5" size="36px" shape="circle">
                <t-avatar v-for="(url, index) in avatarList" :key="index" :image="url" />
              </t-avatar-group>
              <div class="ad-summary__interest">
                {{ interestedCount }}人感兴趣
              </div>
            </div>
          </div>
          <div class="ad-meta">
            <div class="ad-meta__time">
              <div class="ad-meta__item">
                <div class="ad-meta__icon">
                  <TimeIcon size="20" />
                </div>
                <div class="ad-meta__text">
                  时间：{{ dateText }}
                </div>
              </div>
            </div>
            <div class="ad-meta__location">
              <div class="ad-meta__item">
                <div class="ad-meta__icon">
                  <LocationIcon size="20" />
                </div>
                <div class="ad-meta__text">
                  地点：{{ address }}
                </div>
              </div>
              <div class="ad-meta__item">
                <t-button size="extra-small" theme="light">
                  导航
                </t-button>
              </div>
            </div>
          </div>
          <div v-if="detail?.comments?.length" class="ad-reviews">
            <div class="ad-reviews-header">
              <div class="ad-reviews-header__title">
                活动评价({{ detail.comments.length }})
              </div>
              <div class="ad-reviews-header__rate">
                <t-rate :value="star" size="20" variant="filled" allow-half show-text disabled />
              </div>
            </div>
            <div class="ad-reviews-list">
              <t-swiper :autoplay="false" class="ad-reviews-list__swiper">
                <t-swiper-item v-for="c in (detail?.comments ?? [])" :key="c.id">
                  <t-cell :title="c.user" class="ad-reviews-list__item">
                    <template #leftIcon>
                      <t-avatar shape="circle" :image="c.avatar" />
                    </template>
                    <template #description>
                      <div class="ad-reviews-list__content">
                        {{ c.content }}
                      </div>
                    </template>
                  </t-cell>
                </t-swiper-item>
              </t-swiper>
            </div>
          </div>
          <div class="ad-intro">
            <div class="ad-intro__title">
              活动介绍
            </div>
            <div class="ad-intro__content">
              {{ introduce }}
            </div>
          </div>
        </template>
        <template v-else>
          <div>
            <t-skeleton :loading="true" animation="flashed" :row-col="[{ height: '28px', width: '60%' }]" />
            <div style="height: 12px" />
            <t-skeleton :loading="true" animation="flashed" :row-col="[{ height: '36px', width: '50%', type: 'circle' }, { height: '16px', width: '80px' }]" />
            <div style="height: 12px" />
            <t-skeleton :loading="true" animation="flashed" :row-col="[{ height: '20px', width: '100%' }, { height: '20px', width: '70%' }]" />
            <div style="height: 12px" />
            <t-skeleton :loading="true" animation="flashed" :row-col="[{ height: '92px', width: '100%' }]" />
            <div style="height: 12px" />
            <t-skeleton :loading="true" animation="flashed" :row-col="[{ height: '22px', width: '40%' }, { height: '60px', width: '100%' }]" />
          </div>
        </template>
      </div>
    </div>
  </t-popup>
</template>

<style lang="less" scoped>
.ad-popup {
  .flex-col();
  border-radius: 12px;
  background-color: #fff;
  position: relative;
  height: 100%;
  padding-top: 12px;
  &__content {
    .flex-col();
    padding: 12px 16px;
    padding-bottom: 80px;
    gap: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    min-height: 0;
  }
  &__handle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 76px;
    height: 11px;
    top: -10px;
    background: url('@/assets/half-circle.png') no-repeat center center;
    background-size: 100% 100%;
  }
  &__toggle {
    .flex-center();
    height: 11px;
    width: 100%;
    position: absolute;
    z-index: 99;
    top: 0;
    .t-icon {
      color: var(--td-font-gray-2);
    }
  }

  &__toggle--active {
    height: 44px;
    top: -32px;
    z-index: -1;
    background: url('@/assets/mask.png');
    padding-bottom: 12px;
    .t-icon {
      color: var(--td-font-white-1);
      transform: rotate(180deg);
    }
  }
}

.ad-summary {
  padding-bottom: 16px;
  border-bottom: 0.5px solid var(--td-gray-color-3);
  &__title {
    .font(20px, 600);
    color: var(--bg-color-black-colorful);
  }
  &__avatars {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    align-items: center;
    --td-avatar-group-margin-left-medium: -12px;
    .t-avatar__wrapper:nth-child(1) {
      margin-left: 0;
    }
  }
  &__interest {
    .font(12px, 400);
    color: var(--td-font-gray-2);
  }
}

.ad-meta {
  .flex-col();
  .font();
  padding-bottom: 16px;
  border-bottom: 0.5px solid var(--td-gray-color-3);
  gap: 8px;
  &__text {
    margin-left: 4px;
    color: var(--bg-color-black-colorful);
  }
  &__time,
  &__location {
    .flex-center(space-between);
  }

  &__item {
    .flex-center();
    .t-icon {
      color: var(--td-brand-color-7);
    }
  }
}

.ad-reviews {
  padding-bottom: 16px;
  border-bottom: 0.5px solid var(--td-gray-color-3);
}

.ad-reviews-header {
  .flex-center(space-between);
  &__title {
    .font(16px, 600);
    height: 24px;
    color: var(--bg-color-black-colorful);
    text-align: left;
  }
  &__rate {
    --td-rate-text-active-color: var(--td-warning-color-5);
    --td-rate-disabled-selected-color: var(--td-warning-color-5);
    --td-rate-text-font-size: 14px;
    :deep(.t-rate__text) {
      margin-left: 8px;
    }
  }
}

.ad-reviews-list {
  --td-cell-bg-color: var(--td-gray-color-1);
  --td-cell-vertical-padding: 12px;
  margin-top: 12px;
  --ad-swiper-width: 343px;
  &__swiper {
    overflow: visible;
    margin: 0 calc((100vw - var(--ad-swiper-width)) - 48px) 0 0;
  }
  .t-swiper-item {
    width: var(--ad-swiper-width);
    height: 90px;
  }
  &__item {
    height: 90px;
    border-radius: 9px;
    :deep(.t-cell__left) {
      .flex-center();
    }
    :deep(.t-cell__title-text) {
      font-size: 14px;
    }
  }
  &__content {
    .font(12px, 400);
    color: var(--td-font-gray-2);
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.ad-intro {
  &__title {
    .font(16px, 600);
    color: var(--bg-color-black-colorful);
    text-align: left;
  }
  &__content {
    margin-top: 12px;
  }
}
</style>
