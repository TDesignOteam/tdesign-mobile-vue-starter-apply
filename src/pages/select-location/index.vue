<script setup lang="ts">
import { Toast } from 'tdesign-mobile-vue'
import { getCityNameFromCoords } from '@/api/location'
import { processedCityList as cityList } from '@/constant/cityList'
import userInfo from '@/store/userInfo'

const router = useRouter()
const indexList = cityList.map(item => item.index) // 索引列表
const locationStatus = ref(false) // 是否正在定位

/**
 * 更新用户选择的城市
 * @param cityName 选定的城市名称
 */
function updateCity(cityName: string) {
  userInfo.locationName = cityName
  router.back()
}

/**
 * 更新用户当前位置（通过浏览器定位）
 */
function updateLocation() {
  locationStatus.value = true
  if (navigator.geolocation) { // 检查浏览器是否支持地理定位功能
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const cityName = await getCityNameFromCoords(latitude, longitude) // 调用 API 进行逆地理编码，获取城市名称
          if (cityName === '未知城市') {
            throw new Error('无法获取城市信息')
          }
          else {
            userInfo.locationName = cityName // 更新 store 中的城市名称
            Toast({
              className: 'toast-root--success',
              theme: 'success',
              direction: 'column',
              message: '定位成功',
            })
          }
        }
        catch (error) {
          console.error('逆地理编码失败', error)
          Toast({
            theme: 'error',
            direction: 'column',
            message: '定位失败，请稍后重试',
          })
        }
        finally {
          locationStatus.value = false
        }
      },
      (error) => {
        locationStatus.value = false
        console.error('获取地理位置失败', error)
        let msg = ''
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = '您拒绝了地理位置请求'
            break
          case error.POSITION_UNAVAILABLE:
            msg = '位置信息不可用'
            break
          case error.TIMEOUT:
            msg = '获取位置超时'
            break
          default:
            msg = '发生未知错误'
            break
        }
        Toast({
          theme: 'error',
          direction: 'column',
          message: msg,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    )
  }
  else {
    locationStatus.value = false
    Toast('您的浏览器不支持地理位置服务')
  }
}
</script>

<template>
  <header>
    <t-navbar title="选择城市" left-arrow :on-left-click="$router.back" />
    <div class="location-container">
      <div class="location">
        <LocationIcon size="22" />
        <t-loading
          v-if="locationStatus"
          theme="dots"
          size="24px"
          style="margin-left: 8px"
        />
        <span v-else class="location__name">
          {{ userInfo.locationName }}
        </span>
      </div>
      <t-button
        theme="default"
        size="extra-small"
        shape="round"
        :disabled="locationStatus"
        @click="updateLocation"
      >
        {{ locationStatus ? "正在定位" : "更新定位" }}
      </t-button>
    </div>
  </header>
  <main>
    <div class="city-container">
      <t-indexes :index-list="indexList" :sticky="false">
        <template v-for="item in cityList" :key="`city-index-${item.index}`">
          <t-indexes-anchor :index="item.index" />
          <t-cell-group>
            <t-cell
              v-for="(val, i) in item.children"
              :key="`city-${i}`"
              @click="updateCity(val.name)"
            >
              <template #title>
                <span
                  :class="{
                    'city-title--active': userInfo.locationName === val.name,
                  }"
                >
                  {{ val.label }}
                </span>
              </template>
              <CheckIcon
                v-if="userInfo.locationName === val.name"
                size="24"
                class="city-check--active"
              />
            </t-cell>
          </t-cell-group>
        </template>
      </t-indexes>
    </div>
  </main>
</template>

<style lang="less" scoped>
@import './index.less';
</style>
