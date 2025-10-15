<script setup lang="ts">
import { Message } from 'tdesign-mobile-vue'
import { getActivityDetail, getActivityPrices, getActivityTickets } from '@/api/activity'
import userInfo from '@/store/userInfo'
import { formatDate } from '@/utils/date'

interface TicketItem {
  id: string
  activityId: string
  date: string
}

interface PriceItem {
  id: string
  activityId: string
  description: string
  price: number
  originalPrice: number
  person: number
}

const route = useRoute()
const router = useRouter()

// 活动ID
const activityId = computed(() => (route.params as {
  id: string
}).id)

// 活动信息
const eventTitle = ref('')
const eventDate = ref('')
const eventLocation = ref('')

// 加载状态
const loading = ref(true)
const error = ref(false)

// 人员信息 - 从store中获取
const persons = computed(() => userInfo.persons)

const plusIcon = () => h(PlusIcon, { size: '18px' })

// 选中的人员ID数组 - 从store中获取
const selectedPersonIds = computed({
  get: () => userInfo.selectedPersonIds,
  set: (value) => {
    userInfo.selectedPersonIds = value
  },
})

// 票类场次
const tickets = reactive<TicketItem[]>([])
// 选中的票类场次ID
const selectedTicketId = ref('')

// 票档价格
const prices = reactive<PriceItem[]>([])
// 选中的票档价格ID
const selectedPriceId = ref('')

// 计算总价
const totalPrice = computed(() => {
  const selectedPrice = prices.find(p => p.id === selectedPriceId.value)
  if (!selectedPrice)
    return 0

  const personCount = selectedPersonIds.value.length
  const ticketPersonCount = selectedPrice.person

  // 如果是单人票，直接计算票价乘人数
  if (ticketPersonCount === 1) {
    return selectedPrice.price * personCount
  }

  // 如果选择的人数可以被票的person属性整除，计算对应的总价
  if (personCount >= ticketPersonCount && personCount % ticketPersonCount === 0) {
    return selectedPrice.price * (personCount / ticketPersonCount)
  }

  // 默认返回单张票价
  return selectedPrice.price
})

// 验证购买条件
function validatePurchase() {
  const selectedPrice = prices.find(p => p.id === selectedPriceId.value)
  if (!selectedPrice) {
    return {
      valid: false,
      message: '请选择票档',
    }
  }

  const personCount = selectedPersonIds.value.length
  const ticketPersonCount = selectedPrice.person

  // 如果选择的人数少于票的person属性个数
  if (personCount < ticketPersonCount) {
    return {
      valid: false,
      message: `当前票档需要至少${ticketPersonCount}人，您只选择了${personCount}人`,
    }
  }

  // 如果选择的人数不能被票的person属性整除（多人票情况）
  if (ticketPersonCount > 1 && personCount % ticketPersonCount !== 0) {
    return {
      valid: false,
      message: `当前票档为${ticketPersonCount}人票，您选择的人数需要是${ticketPersonCount}的倍数`,
    }
  }

  return {
    valid: true,
    message: '',
  }
}

// 是否可以购买
const canPurchase = computed(() => {
  return selectedPersonIds.value.length > 0 && selectedTicketId.value && selectedPriceId.value
})

// 获取活动信息
async function fetchActivityData() {
  if (!activityId.value) {
    error.value = true
    loading.value = false
    return
  }

  try {
    // 获取活动详情
    const activityData = await getActivityDetail(activityId.value)

    // 设置活动信息
    eventTitle.value = activityData.title
    eventDate.value = formatDate(activityData.date)
    eventLocation.value = activityData.address

    // 获取票类场次
    const ticketsData = await getActivityTickets(activityId.value)

    // 更新票类场次数据
    tickets.length = 0
    tickets.push(...ticketsData)
    if (tickets.length > 0) {
      selectedTicketId.value = tickets[0].id
    }

    // 获取票档价格
    const pricesData = await getActivityPrices(activityId.value)

    // 更新票档价格数据
    prices.length = 0
    prices.push(...pricesData)
    if (prices.length > 0) {
      selectedPriceId.value = prices[0].id
    }

    loading.value = false
  }
  catch (err) {
    console.error('Error fetching data:', err)
    error.value = true
    loading.value = false
    // 找不到活动信息时跳转到404页面
    router.push('/not-found')
  }
}

// 处理票类场次选择变化
function handleTicketChange(value: any) {
  selectedTicketId.value = value
}

// 处理票档价格选择变化
function handlePriceChange(value: any) {
  selectedPriceId.value = value
}

// 增加人员
function addPerson() {
  router.push('/person-info')
}

// 确认购买
function handleConfirmPurchase() {
  // 验证购买条件
  const validation = validatePurchase()
  if (!validation.valid) {
    // 使用TDesign的Message组件显示提示信息
    Message.warning({
      content: validation.message,
      duration: 3000,
    })
    return
  }
  // 跳转到购买结果页面并传递订单信息
  router.push(
    `/buy-result/${activityId.value}`,
  )
}
// 组件挂载时获取数据
onMounted(() => {
  fetchActivityData()
})
</script>

<template>
  <header>
    <t-navbar title="购买确认" left-arrow :on-left-click="$router.back" />
  </header>
  <main>
    <t-sticky :offset-top="48">
      <div class="activity-info">
        <div class="activity-info__title">
          <span>{{ eventTitle }}</span>
        </div>
        <div class="activity-info__details">
          <div class="activity-info__detail-item">
            <TimeIcon size="16px" />
            <span>{{ eventDate }}</span>
          </div>
          <div class="activity-info__detail-item">
            <LocationIcon size="16px" />
            <span>{{ eventLocation }}</span>
          </div>
        </div>
      </div>
    </t-sticky>
    <div class="page-content">
      <!-- 人员信息 -->
      <div class="section">
        <div class="section__header">
          <h3 class="section__title">
            人员信息
          </h3>
          <t-button size="extra-small" shape="round" :icon="plusIcon" @click="addPerson">
            增加人员
          </t-button>
        </div>
        <t-checkbox-group v-model="selectedPersonIds" class="person-grid" borderless>
          <div
            v-for="person in persons"
            :key="person.id"
            :class="`card ${selectedPersonIds.includes(person.id) ? 'card--active' : ''}`"
          >
            <CheckIcon v-if="selectedPersonIds.includes(person.id)" class="card__icon" />
            <t-checkbox :value="person.id" :label="person.name" :icon="false" />
          </div>
        </t-checkbox-group>
      </div>

      <!-- 票类场次 -->
      <div class="section">
        <h3 class="section__title">
          票类场次
        </h3>
        <t-radio-group v-model="selectedTicketId" @change="handleTicketChange">
          <div
            v-for="ticket in tickets"
            :key="ticket.id"
            :class="`card ${selectedTicketId === ticket.id ? 'card--active' : ''}`"
          >
            <CheckIcon v-if="selectedTicketId === ticket.id" class="card__icon" />
            <t-radio
              :value="ticket.id"
              :label="ticket.date"
              icon="none"
              borderless
            />
          </div>
        </t-radio-group>
      </div>

      <!-- 票档价格 -->
      <div class="section">
        <h3 class="section__title">
          票档价格
        </h3>
        <t-radio-group v-model="selectedPriceId" @change="handlePriceChange">
          <div
            v-for="price in prices"
            :key="price.id"
            :class="`card ${selectedPriceId === price.id ? 'card--active' : ''}`"
          >
            <CheckIcon v-if="selectedPriceId === price.id" class="card__icon" />
            <t-radio
              :value="price.id"
              icon="none"
              borderless
            >
              <template #label>
                <div class="price-card">
                  <span>{{ price.description }}</span>
                  <div class="price-card__info">
                    <span class="price-card__current-price">{{ price.price }}元</span>
                    <span v-if="price.originalPrice > price.price" class="price-card__original-price">{{ price.originalPrice }}元</span>
                  </div>
                </div>
              </template>
            </t-radio>
          </div>
        </t-radio-group>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <div class="bottom-action__info">
        <span>待支付:</span>
        <span class="bottom-action__price">¥{{ totalPrice }}</span>
      </div>
      <t-button theme="primary" size="large" :disabled="!canPurchase" @click="handleConfirmPurchase">
        确认购买
      </t-button>
    </div>
  </main>
</template>

<style lang="less" scoped>
@import './index.less';
</style>
