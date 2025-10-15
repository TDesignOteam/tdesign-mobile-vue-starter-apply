<script setup lang="ts">
import type { AppItem, Person } from '@/api/share'
import { Message } from 'tdesign-mobile-vue'
import { getActivityDetail } from '@/api/activity'
import { getAppList, getFriendList } from '@/api/share'
import { formatDate } from '@/utils/date'

const route = useRoute()
const router = useRouter()

function share() {
  return h(ShareIcon, {
    size: '22px',
  })
}

// 控制分享弹窗的显示/隐藏
const isSharePopupVisible = ref(false)

// 活动ID
const activityId = computed(() => (route.params as {
  id: string
}).id)
// 活动信息
const activity = ref({
  name: '',
  date: '',
  address: '',
  cover: '',
})
// 选中的人员
const selectedPerson = ref({
  name: '蔡宣轩',
  age: '29岁',
  occupation: '设计师/艺术从业者',
})

const frendList = reactive <Person[]> ([])
const appList = reactive <AppItem[]> ([])
// 加载状态
const loading = ref(true)

// 获取活动信息
async function fetchActivityData() {
  try {
    // 获取活动详情
    const data = await getActivityDetail(activityId.value)

    // 设置活动信息
    activity.value = {
      name: data.title,
      date: formatDate(data.date),
      address: data.address,
      cover: data.cover,
    }

    loading.value = false
  }
  catch (err) {
    console.error('Error fetching activity data:', err)
    loading.value = false
    // 找不到活动信息时跳转到404页面
    router.push('/not-found')
  }
}

// 获取朋友\app信息
async function fetchFrendandAppdata() {
  try {
    const flresponse = await getFriendList()
    frendList.length = 0
    frendList.push(...flresponse)

    const apdata = await getAppList()
    appList.length = 0
    appList.push(...apdata)
    loading.value = false
  }
  catch (err) {
    console.error('Error fetching data:', err)
    loading.value = false
  }
}

// 分享给朋友
function shareWithFriends() {
  isSharePopupVisible.value = true
}

// 关闭分享弹窗
function closeSharePopup() {
  isSharePopupVisible.value = false
}

// 分享至社媒
function sharemsg() {
  Message.error({
    content: '分享功能待实现',
    duration: 3000,
  })
}

// 去查看
function goToView() {
  router.push(`/activity-detail/${activityId.value}`)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchActivityData()
  fetchFrendandAppdata()
})
</script>

<template>
  <header>
    <t-navbar title="购买结果" left-arrow :on-left-click="$router.back" />
  </header>
  <main>
    <!-- 成功状态 -->
    <t-result class="result-status" theme="success" title="购买成功" description="" />

    <!-- 活动信息卡片 -->
    <div class="activity-card">
      <t-image :src="activity.cover" alt="活动封面" fit="cover" class="activity-card__cover" />
      <h3 class="activity-card__name">
        {{ activity.name }}
      </h3>
      <div class="activity-card__details">
        <div class="activity-card__detail-item">
          <TimeIcon size="16px" />
          <span>{{ activity.date }}</span>
        </div>
        <div class="activity-card__detail-item">
          <LocationIcon size="16px" />
          <span>{{ activity.address }}</span>
        </div>
      </div>
    </div>

    <!-- 报名人员 -->
    <h3 class="section-title">
      报名人员
    </h3>
    <div class="person-info">
      <t-avatar
        class="person-info__avatar"
        image="https://tdesign.gtimg.com/mobile/demos/avatar1.png"
      />
      <div class="person-info__details">
        <div class="person-info__name">
          {{ selectedPerson.name }}
        </div>
        <div class="person-info__desc">
          {{ selectedPerson.age }} {{ selectedPerson.occupation }}
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <t-button
        theme="light"
        variant="outline"
        block
        size="large"
        :icon="share"
        borderless
        @click="shareWithFriends"
      >
        分享给朋友
      </t-button>
      <t-button
        theme="primary"
        block
        size="large"
        borderless
        @click="goToView"
      >
        去查看
      </t-button>
    </div>
  </main>

  <!-- 分享弹窗 -->
  <t-popup
    v-model:visible="isSharePopupVisible"
    placement="bottom"
    :close-on-overlay-click="true"
    :prevent-scroll-through="true"
  >
    <div class="share-popup">
      <div class="share-section">
        <h3 class="share-section__title">
          分享给朋友
        </h3>
        <t-grid :column="0" class="grid-scroll">
          <t-grid-item v-for="frend in frendList" :key="frend.id" :text="frend.name" @click="sharemsg">
            <template #image>
              <t-avatar :image="frend.avatar" size="40px" />
            </template>
          </t-grid-item>
        </t-grid>
      </div>

      <div class="share-section">
        <h3 class="share-section__title">
          分享到社媒
        </h3>
        <t-grid :column="0" class="grid-scroll">
          <t-grid-item v-for="app in appList" :key="app.id" :text="app.name" @click="sharemsg">
            <template #image>
              <t-image :src="app.icon" :style="{ width: '40px', height: '40px' }" />
            </template>
          </t-grid-item>
        </t-grid>
      </div>
      <t-button class="share-popup__btn" block variant="text" @click="closeSharePopup">
        取消
      </t-button>
    </div>
  </t-popup>
</template>

<style lang="less" scoped>
@import './index.less';
</style>
