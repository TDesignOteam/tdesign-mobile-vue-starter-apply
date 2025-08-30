<template>
  <div class="home-container container-view">
    <t-sticky :offset-top="0" :z-index="100">
      <div class="top-container">
        <!-- 位置头部 -->
        <div class="location-header">
          <div class="location-info" @click="goToRegion">
            <location-icon size="18px" />
            <span class="city-name">{{ currentCity }}</span>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="search-bar">
          <t-search
            v-model="value"
            :clearable="true"
            shape="round"
            :placeholder="t('pages.home.search.placeholder')"
          ></t-search>
        </div>
      </div>
    </t-sticky>

    <!-- 热门推荐部分 -->
    <div class="hot-recommendations">
      <div class="title-container">
        <div class="title-text">{{ t('pages.home.recommend') }}</div>
      </div>
      <div class="swiper-wrapper">
        <div class="swiper-container">
          <t-swiper
            :key="recommendList.length"
            :navigation="{ type: 'dots', placement: 'outside' }"
            :autoplay="false"
            @touchmove="handleTouchPrevent"
          >
            <t-swiper-item v-for="(item, index) in recommendList" :key="item.id" style="height: 172px">
              <img :src="item.img" :alt="`推荐活动-${index + 1}`" @click="goToActivityDetail(item.id)" />
            </t-swiper-item>
          </t-swiper>
        </div>
      </div>
    </div>

    <!-- 吸顶部分 -->
    <t-sticky :offset-top="104" :z-index="100">
      <div class="sticky-header">
        <div class="title-container">
          <div class="title-text">{{ t('pages.home.allList') }}</div>
        </div>
        <div class="activity-nav">
          <t-tabs v-model="sortBy" :list="activityTabs" :split="false" class="hidden-track" style="width: 100%">
          </t-tabs>

          <div class="filter-btn">
            <div @click="filterPopupVisible = true">
              <filter-icon size="18px" />
              <span>{{ t('pages.home.filter.text') }}</span>
            </div>
          </div>
        </div>
      </div>
    </t-sticky>

    <!-- 活动列表内容 -->
    <div class="activity-list">
      <activity-list :data="activityListData" :sort-by="sortBy" :filter-by="filterActivityItem" />
    </div>
  </div>
  <!---->
  <t-popup v-model="filterPopupVisible" placement="bottom">
    <div :class="`${prefix}-filter-view`">
      <div :class="`${prefix}-filter-view__header`">
        <div class="title">{{ t('pages.home.filter.title') }}</div>
        <div class="close-icon" @click="filterPopupVisible = false"><close-icon size="24px" /></div>
      </div>
      <div :class="`${prefix}-filter-view__body`">
        <form-render
          :form-options="formOptions"
          :form-config="{ labelAlign: 'top' }"
          :btn-config="btns"
          @confirm="onFilterData"
        />
      </div>
    </div>
  </t-popup>
  <!---->
  <t-popup v-model="datePopupVisible" placement="bottom" :overlay-props="{ backgroundColor: 'transparent' }">
    <div :class="`${prefix}-calendar-view`">
      <div :class="`${prefix}-calendar-view__header`">
        <div class="close-icon" @click="datePopupVisible = false"><chevron-left-icon size="24px" /></div>
        <div class="title">选择日期</div>
        <div class="close-icon" @click="datePopupVisible = false"><close-icon size="24px" /></div>
      </div>
      <div :class="`${prefix}-calendar-view__body`">
        <t-calendar
          v-model:value="chooseDate"
          type="range"
          :min-date="dateMinRange"
          :max-date="dateMaxRange"
          :use-popup="false"
          :confirm-btn="null"
          :on-select="
            (v) => {
              const val = v as unknown as any[];
              chooseDateCache = val;
            }
          "
        >
          <template #title>
            <span></span>
          </template>
        </t-calendar>
        <!---->
        <div :class="`${prefix}-calendar-view__body-btn`">
          <t-button theme="primary" size="large" block @click="onDatePickerConfirm">确认日期</t-button>
        </div>
      </div>
    </div>
  </t-popup>
</template>
<script setup lang="tsx">
import { isEmpty } from 'lodash';
import { ChevronLeftIcon, CloseIcon, FilterIcon, LocationIcon } from 'tdesign-icons-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getAllActivityList, getRecommendList } from '@/api/list';
import type { ActivityModel } from '@/api/model/listModel';
import ActivityList from '@/components/activity-list';
import FormRender from '@/components/form';
import type { BtnConfig, FormItems } from '@/components/form/type';
import { ActivityField, ActivityType } from '@/config/consts';
import { prefix } from '@/config/global';
import { t } from '@/locales';
import { useCityStore } from '@/store';
import { dateIncludes, getDateRangeString } from '@/utils/activity/getDate';
import { getMaxPrice, getMinPrice } from '@/utils/activity/getPrice';

const cityStore = useCityStore();
const router = useRouter();

onMounted(() => {
  getRecommendListData();
  getActivityListData();
});

// 从 store 获取当前城市
const currentCity = computed(() => cityStore.getCurrentCity);
const dateMinRange = new Date(2021, 2, 1);
const dateMaxRange = new Date(2021, 4, 31);
const recommendList = ref([]);
const getRecommendListData = async () => {
  const res = await getRecommendList();
  recommendList.value = res.list;
};

const activityListData = ref([]);
const getActivityListData = async () => {
  const res = await getAllActivityList();
  activityListData.value = res.list;
};

const sortBy = ref('latest');
const activityTabs = [
  {
    value: 'latest',
    label: t('pages.home.filter.latest'),
  },
  {
    value: 'max-evaluate',
    label: t('pages.home.filter.highScore'),
  },
];
const filterOptions = ref<{ [k: string]: any }>({});
const chooseDate = ref<Date[]>([]);
const chooseDateCache = ref([]);
const datePopupVisible = ref(false);
const filterPopupVisible = ref(false);
const formOptions: FormItems[] = [
  {
    id: 'field',
    label: t('pages.home.filter.field'),
    type: 'check-tag',
    class: 'hidden-divider',
    componentProps: {
      options: ActivityField,
    },
  },
  {
    id: 'type',
    label: t('pages.home.filter.type'),
    type: 'check-tag',
    componentProps: {
      options: ActivityType,
    },
  },
  {
    id: 'date',
    label: t('pages.home.filter.date'),
    type: 'custom',
    component: () => {
      return (
        <div class="filter-view__date-filter">
          <span>{chooseDate.value?.length === 0 ? '全部' : getDateRangeString(chooseDate.value)}</span>
          <t-button theme="default" size="extra-small" shape="round" onClick={() => (datePopupVisible.value = true)}>
            选择日期
          </t-button>
        </div>
      );
    },
  },
  {
    id: 'price',
    label: t('pages.home.filter.price'),
    type: 'slider',
    componentProps: {
      min: 0,
      max: 588,
      defaultValue: [58, 288],
    },
  },
];
const btns: BtnConfig[] = [
  {
    theme: 'light',
    size: 'large',
    type: 'reset',
    block: true,
    t: 'pages.home.reset',
  },
  {
    theme: 'primary',
    size: 'large',
    type: 'submit',
    block: true,
    t: 'pages.home.confirm',
  },
];

// 跳转到地区选择页面
const goToRegion = () => {
  router.push('/home/region');
};

const goToActivityDetail = (id: string) => {
  console.log(id);
  router.push(`/activity/${id}`);
};

const onFilterData = (_verify: boolean, data: any) => {
  filterOptions.value = data;
  filterPopupVisible.value = false;
};

const includes = (main: string | string[], sub: string[]) => {
  const mainArray = typeof main === 'string' ? [main] : main;
  if (!Array.isArray(mainArray)) {
    throw new TypeError('main must be a string or an array');
  }
  return sub.some((item) => mainArray.includes(item));
};

const filterActivityItem = (item: ActivityModel) => {
  const filterKey = Object.keys(filterOptions.value);
  // no filter
  if (isEmpty(filterKey)) {
    return true;
  }

  let result = true;

  // 面向领域
  if (result && filterOptions.value.field && filterOptions.value.field.length > 0) {
    result = Array.isArray(item.field)
      ? item.field.some((field) => filterOptions.value.field.includes(field))
      : filterOptions.value.field.includes(item.field);
  }

  // 活动形式
  if (result && filterOptions.value.type && filterOptions.value.type.length > 0) {
    result = includes(item.type, filterOptions.value.type);
  }

  // 价格范围
  if (result && filterOptions.value.price && filterOptions.value.price.length === 2) {
    const [minPrice, maxPrice] = filterOptions.value.price;
    const itemMinPrice = getMinPrice(item);
    const itemMaxPrice = getMaxPrice(item);

    result =
      (Number(itemMinPrice) >= minPrice && Number(itemMaxPrice) <= maxPrice) ||
      (Number(itemMinPrice) <= maxPrice && Number(itemMaxPrice) >= minPrice);
  }

  // 日期范围
  if (result && chooseDate.value && chooseDate.value.length === 2 && filterOptions.value?.date !== '') {
    result = dateIncludes(item, chooseDate.value);
  }

  return result;
};

const onDatePickerConfirm = () => {
  chooseDate.value = chooseDateCache.value;
  datePopupVisible.value = false;
};

// 防止页面晃动的触摸事件处理
const handleTouchPrevent = (e: TouchEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const value = ref('');
</script>
<style scoped lang="less">
@import './index.less';
</style>
