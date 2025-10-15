<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: value => ['401', '403', '404', '500'].includes(value),
  },
})

const config = {
  401: {
    title: '认证失败',
    description: '抱歉，您没有权限访问该页面，请登录后重试',
    color: 'var(--td-warning-color)',
  },
  403: {
    title: '禁止访问',
    description: '抱歉，您的权限不足，无法访问此页面',
    color: 'var(--td-warning-color)',
  },
  404: {
    title: '页面不存在',
    description: '这个页面似乎在数字世界的某个角落迷路了',
    color: 'var(--td-brand-color-7)',
  },
  500: {
    title: '服务器错误',
    description: '服务器开小差了，请稍后刷新或联系管理员',
    color: 'var(--td-error-color)',
  },
}

const pageConfig = computed(() => config[props.status] || config['404'])
const router = useRouter()

function goHome() {
  router.push('/main/base')
}
function goBack() {
  router.back()
}
</script>

<template>
  <div class="error-page-container">
    <t-result>
      <template #image>
        <div class="status-code" :style="{ color: pageConfig.color }">
          <span>{{ status }}</span>
        </div>
      </template>
      <template #title>
        <div>{{ pageConfig.title }}</div>
      </template>
      <template #description>
        <div>{{ pageConfig.description }}</div>
      </template>
    </t-result>
    <div class="button-group">
      <t-button theme="primary" @click="goHome">
        返回到首页
      </t-button>
      <t-button theme="default" variant="outline" @click="goBack">
        返回上一页
      </t-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.error-page-container {
  .flex-center();
  flex-direction: column;
  height: 100vh;
  background-image: url('@/assets/head-bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  text-align: center;
}

.status-code {
  font-size: 80px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin: 24px 0;
}
</style>
