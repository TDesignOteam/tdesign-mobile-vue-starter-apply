<script setup lang="ts">
interface SwiperItem {
  id: string
  name: string
  url: string
}

const props = withDefaults(
  defineProps<{
    swiperList: SwiperItem[]
    isFetchSwiperList?: boolean
    swiperGap?: number
    swiperReady?: boolean
    autoplay?: boolean // 自动播放
    navigation?: Record<string, any> | undefined // 自定义 navigation
    height?: number | string
    marginPosition?: 'both' | 'right' | 'left' // 边距位置，控制是两侧/左/右
  }>(),
  {
    isFetchSwiperList: false,
    swiperGap: 12,
    swiperReady: true,
    autoplay: true,
    height: 159.2,
    marginPosition: 'both',
  },
)

const resolvedNavigation = computed(() => props.navigation ?? { type: 'dots', placement: 'outside' })

const swiperStyle = computed(() => {
  const sideSpace = `calc(100vw - var(--swiper-width))`
  if (props.marginPosition === 'right') {
    return {
      margin: `0 calc(${sideSpace} - ${props.swiperGap}px) 0 0`,
    }
  }
  else if (props.marginPosition === 'left') {
    return {
      margin: `0 -${props.swiperGap}px 0 ${sideSpace}`,
    }
  }
  else {
    return {
      margin: `0 calc(${sideSpace} / 2 - ${props.swiperGap}px) 0 calc(${sideSpace} / 2)`,
    }
  }
})
</script>

<template>
  <div class="swiper-container">
    <div v-show="!swiperReady || props.swiperList.length === 0">
      <div class="swiper-placeholder">
        <div
          v-show="marginPosition !== 'right'"
          class="swiper-placeholder__side swiper-img"
          style="border-radius: 0 9px 9px 0; margin-right: 12px;"
        />
        <div class="swiper-placeholder__main swiper-img">
          <span v-show="!isFetchSwiperList && props.swiperList.length === 0">暂无轮播图数据</span>
        </div>
        <div
          v-show="marginPosition !== 'left'"
          class="swiper-placeholder__side swiper-img"
          style="border-radius: 9px 0 0 9px; margin-left: 12px;"
        />
      </div>
      <div class="dots-placeholder">
        <t-loading
          v-if="isFetchSwiperList"
          :pause="!isFetchSwiperList"
          theme="dots"
          :duration="5000"
          size="30px"
        />
      </div>
    </div>
    <div
      v-if="swiperReady && props.swiperList.length > 0"
    >
      <t-swiper
        :height="props.height"
        :autoplay="props.autoplay"
        :navigation="resolvedNavigation"
        class="swiper"
        :style="swiperStyle"
      >
        <t-swiper-item v-for="item in props.swiperList" :key="item.id">
          <t-image :src="item.url" :alt="item.name" fit="cover" />
        </t-swiper-item>
      </t-swiper>
    </div>
  </div>
</template>

<style scoped lang="less">
.swiper-container {
  height: calc(var(--swiper-height) + 18px);
}

.dots-placeholder {
  display: flex;
  height: 18px;
  .t-loading {
    bottom: 0;
    margin: auto;
  }
}

.swiper-placeholder {
  .flex-center();
  flex-grow: 1;
  height: var(--swiper-height);
  &__main {
    .flex-center();
    width: var(--swiper-width);
  }
  .swiper-img {
    height: 100%;
    border-radius: var(--td-radius-large);
    background-color: var(--td-gray-color-1);
  }
  &__side {
    flex-grow: 1;
  }
}

.swiper {
  overflow: visible;
  .t-image {
    width: var(--swiper-width);
    height: 100%;
    box-shadow: var(--td-shadow-3);
  }
}
</style>
