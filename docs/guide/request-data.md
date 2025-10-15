# 请求与数据

## 发起请求

本项目采用 `axios` 做为请求的资源库，并进行了二次封装。

您可以直接从 `@/utils/request` 导入使用。大部分情况下，不需要改动 `src/utils/request` 中的代码，只需要在 `src/api/` 中新增您使用的接口，并在页面中引入接口使用即可。

通过引入封装好的 `axios` 实例发起请求，示例如下：

```typescript [src/api/activity.ts]
import axios from '@/utils/request'

export function getHomeSwiper() {
  return axios.get('/homeSwiper')
}
```

然后在实例组件导入定义的接口即可：

```typescript [src/hooks/useHomeSwiper.ts]
import { getHomeSwiper } from '@/api/activity'

async function fetchSwiperList() {
  try {
    const res = await getHomeSwiper()
    swiperList.value = res.data
  }
  catch (error) {
    console.error('获取轮播图列表失败:', error)
  }
  finally {
    isFetchSwiperList.value = false
  }
}
```

项目中的请求封装主要有以下特性：

- 统一的 `baseURL` 配置
- 3 秒的请求超时限制
- 响应拦截器自动提取 `response.data`
- [统一错误处理和提示机制（可自定义）](#error-handling-custom)

## Mock 服务

项目使用 [MSW (Mock Service Worker)](https://mswjs.io/) 作为 `Mock` 解决方案，在开发环境中拦截请求并返回模拟数据。

实际项目中，代理配置会将 `/api` 开头的请求转发到后端服务器，实现跨域请求处理。在开发环境中，如果启用了 `Mock` 功能，请求会被 `MSW` 拦截，不会真正发送到代理服务器。

### 启用方式

`Mock` 功能通过环境变量控制，默认在开发环境中启用：

```ini [.env.development]
VITE_APP_ENABLE_MOCKS=true
```

### Mock 配置

- `/mocks/browser.ts`：在浏览器环境中设置 `MSW`
- `/mocks/handlers.ts`：定义所有需要 `Mock` 的 `API` 路由和对应的处理逻辑
- `/mocks/db.ts`：创建和管理虚拟数据

### 使用示例

在 `/mocks/handlers.ts` 中定义 `Mock` 路由：

```typescript [mocks/handlers.ts]
export const handlers = [
  http.get('/api/share/friends', () => {
    const friendList = db.friendList.getAll()
    return HttpResponse.json(friendList)
  }),
]
```

## 统一错误处理与提示

项目对错误处理与提示做了统一封装，并提供“全局配置 + 单次请求覆盖”的可定制机制，位于 `@/utils/request` 与 `@/utils/http/`。

- 全局开关/函数：`setGlobalErrorToast(option)`
- 单次请求覆盖：在 `axios` 请求配置中传入 `errorToast`
- 去重与节流：`setToastDedupInterval(ms)`
- 自定义提示载体：`setErrorNotifier(fn)`（默认使用 `tdesign-mobile-vue` 的 `Toast`）
- 401 统一处理：`setUnauthorizedHandler(handler)`

::: tip 默认行为：

- 响应拦截器自动返回 `response.data`
- 无响应时提示“请求失败”
- 401 会触发外部注入的未认证处理（如跳转登录），并按规则提示
  :::

### 自定义全局配置

```typescript [应用初始化处.ts]
import type { HttpErrorInfo } from '@/utils/http'
import { Toast } from 'tdesign-mobile-vue'
import {
  setErrorNotifier,
  setGlobalErrorToast,
  setToastDedupInterval,
  setUnauthorizedHandler
} from '@/utils/http'
// import router from '@/router' // 如需跳转

// 1) 替换提示载体（可接入埋点/自定义 UI）
setErrorNotifier((message: string) => {
  Toast({ message, duration: 2000 })
})

// 2) 全局控制提示内容/是否提示
// - 传入 boolean
//   true: 按照默认规则显示提示
//   false: 全局静默（常用于交互型页面，仅在必要处按请求覆盖）
// - 传入函数
//   返回字符串：展示该文案
//   返回 false：当前错误不提示
setGlobalErrorToast((error: HttpErrorInfo) => {
  if (error.status === 500)
    return '服务繁忙，请稍后重试'
  if (error.status === 404)
    return '资源不存在或已移除'
  return error.message // 兜底沿用内置映射
})

// 3) 设置提示的内容去重/节流时间窗口（毫秒）
setToastDedupInterval(1000)

// 4) 统一 401 处理（如跳转登录/刷新 Token）
setUnauthorizedHandler((error: HttpErrorInfo) => {
  if (error.status === 401) {
    Toast({ message: '请先登录' })
    // router.replace({ path: '/login', query: { redirect: location.pathname + location.search } })
  }
})
```

### 按请求覆盖

在单次请求中通过 `axios` 的配置项 `errorToast` 定制提示策略（类型见下文）。

```typescript
import axios from '@/utils/request'

// 1) 静默当前请求（不弹出错误提示）
await axios.get('/api/demo', { errorToast: false })

// 2) 自定义当前请求的提示文案
await axios.post(
  '/api/submit',
  { /* data */ },
  {
    errorToast: (error) => {
      if (error.status === 422)
        return '表单校验未通过'
      if (error.status === 403)
        return '暂无权限'
      return error.message // 返回字符串则展示；返回 false 则静默
    },
  },
)
```

### 错误对象类型

`HttpErrorInfo` 统一描述了错误信息，便于在全局/局部回调内做分支处理：

```typescript [src/utils/http/types.ts]
interface HttpErrorInfo {
  status?: number
  message: string
  code?: string
  data?: unknown
  config?: unknown
}
```

在请求被取消的情况下，`message` 为“请求已取消”；无响应时为“请求失败”。

### 去重与节流

错误提示采用“内容 + 时间窗口”的去重策略：相同文案在设定的时间窗口内只提示一次。

```typescript [src/utils/http/dedup.ts]
import { setToastDedupInterval } from '@/utils/http'

setToastDedupInterval(800) // 默认 800ms，可按需调整
```

### 类型扩展（按请求 `errorToast`）

为方便在请求配置中直接书写 `errorToast`，项目通过类型声明扩展了 `axios` 的 `AxiosRequestConfig`：

```typescript [types/http-axios.d.ts]
import type { ErrorToastOption } from '@/utils/http/types'
import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    errorToast?: ErrorToastOption
  }
}
```

其中 `ErrorToastOption` 的定义为：

```typescript [src/utils/http/types.ts]
type ErrorToastOption = boolean | ((error: HttpErrorInfo) => string | false)
```
