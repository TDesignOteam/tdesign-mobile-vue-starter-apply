<template>
  <div class="region-container container-view">
    <!-- 顶部当前定位信息 -->
    <div class="current-location">
      <div class="location-info">
        <location-icon size="20px" color="#666" />
        <span class="city-name">{{ currentLocation.city || '定位中...' }}</span>
        <t-icon v-if="currentLocation.isLocating" name="loading" size="16" class="loading-icon" />
      </div>
      <t-button size="extra-small" shape="round" :disabled="currentLocation.isLocating" @click="updateLocation">
        {{ currentLocation.isLocating ? '定位中...' : '更新定位' }}
      </t-button>
    </div>

    <!-- 城市列表容器 -->
    <div class="city-list-container">
      <t-indexes :index-list="indexList">
        <template v-for="group in cityGroupsList" :key="group.index">
          <t-indexes-anchor :index="group.index" />
          <t-cell-group>
            <t-cell
              v-for="city in group.children"
              :key="city.value"
              :title="city.label"
              :class="{ active: city.value === currentCity }"
              @click="selectCity(city)"
            >
              <template #right-icon>
                <check-icon v-if="city.value === currentCity" size="24" color="var(--td-brand-color)" />
              </template>
            </t-cell>
          </t-cell-group>
        </template>
      </t-indexes>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CheckIcon, LocationIcon } from 'tdesign-icons-vue-next';
import { Toast } from 'tdesign-mobile-vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { cityGroup, indexList } from '@/constants';
import { useCityStore } from '@/store/modules/city';
import type { City } from '@/types/interface';

const router = useRouter();
const cityStore = useCityStore();

// 当前定位信息
const currentLocation = ref({
  city: cityStore.getCurrentCity, // 从 store 获取
  latitude: null as number | null,
  longitude: null as number | null,
  isLocating: false,
  lastUpdate: null as Date | null,
});

// 当前选中的城市
const currentCity = ref(cityStore.getCurrentCity);

// 转换为 t-indexes 需要的数据格式
const cityGroupsList = computed(() => {
  return Object.entries(cityGroup).map(([index, cities]) => ({
    index,
    children: cities,
  }));
});

// 选择城市
const selectCity = (city: City) => {
  const cityName = `${city.value}`;
  currentCity.value = cityName;
  currentLocation.value.city = cityName;

  // 更新 store 中的城市
  cityStore.setCurrentCity(cityName);

  setTimeout(() => {
    router.go(-1);
  }, 300);
};

// 更新定位
const updateLocation = async () => {
  if (currentLocation.value.isLocating) return;

  currentLocation.value.isLocating = true;

  try {
    if (!navigator.geolocation) {
      throw new Error('您的浏览器不支持地理定位功能');
    }

    const position = await getCurrentPosition();
    const cityInfo = await getCityFromCoordinates(position.coords.latitude, position.coords.longitude);

    const cityName = cityInfo.city || cityInfo.province || '未知城市';

    currentLocation.value = {
      city: cityName,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      isLocating: false,
      lastUpdate: new Date(),
    };

    currentCity.value = cityName;

    // 更新 store 中的城市
    cityStore.setCurrentCity(cityName);

    Toast.success(`定位成功：${cityName}`);
  } catch (error) {
    console.error('定位失败:', error);
    let errorMessage = '定位失败，请重试';

    if (error instanceof GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = '定位权限被拒绝，请在设置中开启定位权限';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = '位置信息不可用，请检查网络连接';
          break;
        case error.TIMEOUT:
          errorMessage = '定位超时，请重试';
          break;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    Toast.error(errorMessage);
    currentLocation.value.isLocating = false;
  }
};

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000,
    };
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

const getCityFromCoordinates = async (_latitude: number, _longitude: number) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockCityData = {
      city: '深圳市',
      province: '广东省',
      district: '南山区',
      address: '广东省深圳市南山区',
    };
    return mockCityData;
  } catch (error) {
    console.error('获取城市信息失败:', error);
    throw new Error('无法获取城市信息');
  }
};

onMounted(async () => {
  // 初始化城市 store
  cityStore.initCity();

  const cachedLocation = localStorage.getItem('cachedLocation');
  if (cachedLocation) {
    try {
      const parsed = JSON.parse(cachedLocation);
      const cacheAge = Date.now() - new Date(parsed.lastUpdate).getTime();
      if (cacheAge < 30 * 60 * 1000) {
        currentLocation.value = parsed;
        currentCity.value = parsed.city;
        // 同步到 store
        cityStore.setCurrentCity(parsed.city);
        return;
      }
    } catch (e) {
      console.error('解析缓存定位信息失败:', e);
    }
  }

  try {
    await updateLocation();
  } catch (error) {
    console.error('自动定位失败:', error);
  }
});

watch(
  currentLocation,
  (newLocation) => {
    if (newLocation.city && newLocation.lastUpdate) {
      localStorage.setItem('cachedLocation', JSON.stringify(newLocation));
    }
  },
  { deep: true },
);
</script>
<style scoped lang="less">
@import './index.less';
</style>
