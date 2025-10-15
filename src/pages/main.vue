<script setup lang="ts">
import userInfo from '@/store/userInfo'

defineOptions({
  name: 'MainPage',
})

const route = useRoute()
const router = useRouter()

interface TabbarItem {
  label: string
  name: string
  icon: Component | string
  showTitle?: boolean | undefined
  showLocation?: boolean | undefined
  bgColor?: string | undefined
}

const tabbarList: TabbarItem[] = [
  {
    label: '首页',
    name: '/main/base/',
    icon: HomeIcon,
    showLocation: true,
    bgColor: 'var(--bg-color-page)',
  },
  {
    label: '我的',
    name: '/main/user/',
    icon: UserIcon,
    showTitle: true,
    bgColor: 'var(--bg-color-secondarypage)',
  },
]

const currentInfo = ref({ ...tabbarList[0] })

onMounted(() => {
  const info = tabbarList.find((item: TabbarItem) => item.name === route.name)
  if (info) {
    currentInfo.value = { ...info }
  }
})

watch(
  () => route.name,
  (newName: string) => {
    const info = tabbarList.find((item: TabbarItem) => item.name === newName)
    if (info) {
      currentInfo.value = { ...info }
    }
  },
)

function handleTabbarChange(name: string | number) {
  if (typeof name !== 'string')
    return
  router.push(name)
}
</script>

<template>
  <header>
    <t-navbar
      :title="currentInfo.showTitle ? currentInfo.label : ''"
      :style="{
        '--navbar-bg-color': currentInfo.bgColor,
      }"
    >
      <template #left>
        <div
          v-if="currentInfo.showLocation"
          class="location"
          @click="router.push('/select-location')"
        >
          <LocationIcon size="16" />
          <span class="location__text">{{ userInfo.locationName }}</span>
        </div>
      </template>
    </t-navbar>
  </header>
  <main class="main-content">
    <RouterView v-slot="{ Component }">
      <KeepAlive :include="['MainIndex']">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </main>
  <footer>
    <t-tab-bar
      v-model="currentInfo.name"
      :split="false"
      theme="tag"
      @change="handleTabbarChange"
    >
      <t-tab-bar-item
        v-for="item in tabbarList"
        :key="item.name"
        :value="item.name"
      >
        {{ item.label }}
        <template #icon>
          <component :is="item.icon" />
        </template>
      </t-tab-bar-item>
    </t-tab-bar>
  </footer>
</template>

<style lang="less" scoped>
.location {
  .flex-center();
  &__text {
    line-height: 22px;
    padding-left: 4px;
  }
}

.main-content {
  padding-top: var(--navbar-height);
  padding-bottom: var(--tabbar-height);
}

:deep(.t-navbar) {
  &__content {
    background-image: url('@/assets/head-bg.png');
    background-position: left var(--status-bar-height);
    background-repeat: no-repeat;
    background-size: cover;
    background-color: var(--navbar-bg-color);
  }
  &__left {
    margin-left: 16px;
  }
}
</style>
