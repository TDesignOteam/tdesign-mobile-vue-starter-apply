# 开发指南

本文档提供了 TDesign 移动端活动报名系统的详细开发指南，包括项目架构、开发规范、最佳实践等内容。

## 📋 目录

- [项目架构](#项目架构)
- [开发环境搭建](#开发环境搭建)
- [代码规范](#代码规范)
- [组件开发](#组件开发)
- [状态管理](#状态管理)
- [路由配置](#路由配置)
- [API 接口](#api-接口)
- [样式开发](#样式开发)
- [国际化](#国际化)
- [性能优化](#性能优化)
- [部署指南](#部署指南)

## 🏗 项目架构

### 技术选型理由

#### Vue 3 + Composition API
- **响应式系统优化**: Vue 3 的响应式系统基于 Proxy，性能更好
- **Composition API**: 更好的逻辑复用和 TypeScript 支持
- **Tree-shaking**: 更小的打包体积

#### TypeScript
- **类型安全**: 编译时错误检查，减少运行时错误
- **开发体验**: 更好的 IDE 支持和代码提示
- **代码质量**: 强制类型约束，提升代码可维护性

#### Vite
- **快速启动**: 基于 ESM 的开发服务器，启动速度快
- **热更新**: 精确的热更新，开发体验好
- **构建优化**: 基于 Rollup 的生产构建，优化效果好

#### Pinia
- **Vue 3 原生支持**: 专为 Vue 3 设计的状态管理库
- **TypeScript 友好**: 完整的 TypeScript 支持
- **开发工具**: 优秀的 DevTools 支持

### 架构设计原则

#### 分层架构
```
┌─────────────────┐
│   Presentation  │  <- 页面组件 (Pages)
├─────────────────┤
│    Business     │  <- 业务组件 (Components)
├─────────────────┤
│     Service     │  <- 服务层 (API/Store)
├─────────────────┤
│      Utils      │  <- 工具层 (Utils/Hooks)
└─────────────────┘
```

#### 模块化设计
- **页面模块**: 按功能划分页面模块
- **组件模块**: 可复用的业务组件
- **服务模块**: API 接口和状态管理
- **工具模块**: 通用工具函数

## 🛠 开发环境搭建

### 系统要求
- **操作系统**: Windows 10+, macOS 10.15+, Linux
- **Node.js**: >= 18.18.0 (推荐使用 LTS 版本)
- **包管理器**: npm >= 7 / yarn >= 1.22 / pnpm >= 9.15.9

### IDE 推荐配置

#### VS Code 扩展
```json
{
  "recommendations": [
    "vue.volar",
    "vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint"
  ]
}
```

#### VS Code 设置
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.codeActions.enabled": true
}
```

### 环境变量配置

#### 开发环境 (.env.development)
```bash
# API 配置
VITE_API_URL_PREFIX=/api
VITE_API_BASE_URL=http://localhost:52000

# 应用配置
VITE_APP_TITLE=TDesign 活动报名系统
VITE_BASE_URL=/

# 功能开关
VITE_ENABLE_MOCK=true
VITE_ENABLE_VCONSOLE=true
```

#### 生产环境 (.env.production)
```bash
# API 配置
VITE_API_URL_PREFIX=/api
VITE_API_BASE_URL=https://api.example.com

# 应用配置
VITE_APP_TITLE=TDesign 活动报名系统
VITE_BASE_URL=/tdesign-mobile-vue-starter-apply/

# 功能开关
VITE_ENABLE_MOCK=false
VITE_ENABLE_VCONSOLE=false
```

## 📝 代码规范

### 文件命名规范

#### 组件文件
```bash
# 页面组件 - PascalCase
src/pages/ActivityDetail/index.vue
src/pages/OrderConfirm/index.vue

# 业务组件 - PascalCase
src/components/ActivityCard/index.vue
src/components/UserAvatar/index.vue

# 工具组件 - PascalCase
src/components/common/Loading/index.vue
src/components/common/Empty/index.vue
```

#### 样式文件
```bash
# 组件样式 - 与组件同名
src/pages/ActivityDetail/index.less
src/components/ActivityCard/index.less

# 全局样式 - kebab-case
src/style/global.less
src/style/variables.less
src/style/mixins.less
```

#### 工具文件
```bash
# 工具函数 - camelCase
src/utils/formatDate.ts
src/utils/validateForm.ts

# 类型定义 - PascalCase
src/types/Activity.ts
src/types/User.ts
```

### TypeScript 规范

#### 接口定义
```typescript
// 基础接口
interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 业务接口
interface ActivityModel {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  price: number | 'free';
  images: string[];
  status: 'upcoming' | 'ongoing' | 'ended';
}

// API 响应接口
interface ActivityListResponse extends BaseResponse {
  data: {
    list: ActivityModel[];
    total: number;
    page: number;
    pageSize: number;
  };
}
```

#### 组件 Props 定义
```typescript
// 使用 interface 定义 Props
interface ActivityCardProps {
  activity: ActivityModel;
  showPrice?: boolean;
  onClick?: (activity: ActivityModel) => void;
}

// 组件中使用
const props = withDefaults(defineProps<ActivityCardProps>(), {
  showPrice: true,
});
```

#### 组合式函数
```typescript
// 自定义 Hook
export function useActivityList() {
  const loading = ref(false);
  const list = ref<ActivityModel[]>([]);
  const error = ref<string | null>(null);

  const fetchList = async (params?: ActivityListParams) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getActivityList(params);
      list.value = response.data.list;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取数据失败';
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    list: readonly(list),
    error: readonly(error),
    fetchList,
  };
}
```

### ESLint 配置

#### 核心规则
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@antfu/eslint-config-vue',
    '@vue/eslint-config-typescript',
  ],
  rules: {
    // Vue 相关
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/no-unused-vars': 'error',
    
    // TypeScript 相关
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // 通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
```

## 🧩 组件开发

### 组件设计原则

#### 单一职责原则
每个组件只负责一个明确的功能：

```vue
<!-- ✅ 好的例子 - 单一职责 -->
<template>
  <div class="activity-card">
    <img :src="activity.image" :alt="activity.name">
    <h3>{{ activity.name }}</h3>
    <p>{{ activity.description }}</p>
  </div>
</template>

<!-- ❌ 不好的例子 - 职责过多 -->
<template>
  <div class="activity-page">
    <!-- 包含了搜索、列表、分页等多个功能 -->
  </div>
</template>
```

#### 可配置性原则
通过 Props 提供灵活的配置选项：

```vue
<template>
  <div class="user-avatar" :class="avatarClass">
    <img v-if="src" :src="src" :alt="alt">
    <div v-else class="user-avatar__placeholder">
      {{ placeholder }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square';
  placeholder?: string;
}

const props = withDefaults(defineProps<UserAvatarProps>(), {
  size: 'medium',
  shape: 'circle',
  placeholder: '用户',
});

const avatarClass = computed(() => [
  `user-avatar--${props.size}`,
  `user-avatar--${props.shape}`,
]);
</script>
```

#### 可扩展性原则
预留插槽和事件接口：

```vue
<template>
  <div class="activity-card" @click="handleClick">
    <slot name="header">
      <img :src="activity.image" :alt="activity.name">
    </slot>
    
    <div class="activity-card__content">
      <slot name="content">
        <h3>{{ activity.name }}</h3>
        <p>{{ activity.description }}</p>
      </slot>
    </div>
    
    <div class="activity-card__footer">
      <slot name="footer" :activity="activity">
        <button @click.stop="handleFavorite">收藏</button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ActivityCardEmits {
  click: [activity: ActivityModel];
  favorite: [activity: ActivityModel];
}

const emit = defineEmits<ActivityCardEmits>();

const handleClick = () => {
  emit('click', props.activity);
};

const handleFavorite = () => {
  emit('favorite', props.activity);
};
</script>
```

### 组件文档规范

每个组件都应该包含完整的文档：

```vue
<!--
# ActivityCard 组件

活动卡片组件，用于展示活动的基本信息。

## Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| activity | ActivityModel | - | 活动数据 |
| showPrice | boolean | true | 是否显示价格 |
| clickable | boolean | true | 是否可点击 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | activity: ActivityModel | 点击卡片时触发 |
| favorite | activity: ActivityModel | 点击收藏时触发 |

## Slots

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| header | - | 头部内容 |
| content | - | 主体内容 |
| footer | activity: ActivityModel | 底部内容 |

## 示例

```vue
<activity-card
  :activity="activity"
  :show-price="true"
  @click="handleActivityClick"
  @favorite="handleFavorite"
>
  <template #footer="{ activity }">
    <custom-button>{{ activity.price }}</custom-button>
  </template>
</activity-card>
```
-->
```

## 🗄 状态管理

### Pinia Store 设计

#### Store 结构规范
```typescript
// stores/activity.ts
export const useActivityStore = defineStore('activity', {
  // 状态定义
  state: (): ActivityState => ({
    // 列表数据
    list: [],
    loading: false,
    error: null,
    
    // 分页信息
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
    },
    
    // 当前选中项
    currentActivity: null,
    
    // 筛选条件
    filters: {
      category: '',
      location: '',
      priceRange: [0, 1000],
    },
  }),

  // 计算属性
  getters: {
    // 过滤后的列表
    filteredList: (state) => {
      return state.list.filter(activity => {
        // 筛选逻辑
        return true;
      });
    },
    
    // 是否有更多数据
    hasMore: (state) => {
      const { page, pageSize, total } = state.pagination;
      return page * pageSize < total;
    },
    
    // 当前活动详情
    currentActivityDetail: (state) => {
      return state.currentActivity;
    },
  },

  // 操作方法
  actions: {
    // 获取活动列表
    async fetchActivityList(params?: ActivityListParams) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await getActivityList({
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...params,
        });
        
        if (params?.append) {
          this.list.push(...response.data.list);
        } else {
          this.list = response.data.list;
        }
        
        this.pagination = {
          ...this.pagination,
          total: response.data.total,
        };
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取数据失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // 设置当前活动
    setCurrentActivity(activity: ActivityModel | null) {
      this.currentActivity = activity;
    },
    
    // 更新筛选条件
    updateFilters(filters: Partial<ActivityFilters>) {
      this.filters = { ...this.filters, ...filters };
      // 重新获取数据
      this.pagination.page = 1;
      this.fetchActivityList();
    },
    
    // 加载更多
    async loadMore() {
      if (!this.hasMore || this.loading) return;
      
      this.pagination.page += 1;
      await this.fetchActivityList({ append: true });
    },
    
    // 重置状态
    reset() {
      this.$reset();
    },
  },

  // 持久化配置
  persist: {
    key: 'activity-store',
    storage: localStorage,
    paths: ['filters', 'currentActivity'],
  },
});
```

#### Store 使用规范

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useActivityStore } from '@/stores/activity';

const activityStore = useActivityStore();

// 响应式数据 - 使用 storeToRefs
const { list, loading, error, hasMore } = storeToRefs(activityStore);

// 方法 - 直接解构
const { fetchActivityList, loadMore, updateFilters } = activityStore;

// 组件挂载时获取数据
onMounted(() => {
  fetchActivityList();
});

// 监听筛选条件变化
watch(
  () => activityStore.filters,
  (newFilters) => {
    console.log('筛选条件变化:', newFilters);
  },
  { deep: true }
);
</script>
```

## 🛣 路由配置

### 路由结构设计

```typescript
// router/modules/activity.ts
export const activityRoutes: RouteRecordRaw[] = [
  {
    path: '/activity',
    name: 'Activity',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'ActivityList',
        component: () => import('@/pages/activity/List/index.vue'),
        meta: {
          title: '活动列表',
          keepAlive: true,
        },
      },
      {
        path: ':id',
        name: 'ActivityDetail',
        component: () => import('@/pages/activity/Detail/index.vue'),
        meta: {
          title: '活动详情',
          requiresAuth: false,
        },
        props: (route) => ({
          id: Number(route.params.id),
        }),
      },
    ],
  },
];
```

### 路由守卫

```typescript
// router/guards.ts
import type { Router } from 'vue-router';
import { useUserStore } from '@/stores/user';

export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    // 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - TDesign 活动报名系统`;
    }
    
    // 权限验证
    if (to.meta?.requiresAuth) {
      const userStore = useUserStore();
      
      if (!userStore.isLoggedIn) {
        next({
          name: 'Login',
          query: { redirect: to.fullPath },
        });
        return;
      }
    }
    
    next();
  });
  
  // 全局后置守卫
  router.afterEach((to, from) => {
    // 页面访问统计
    console.log(`页面跳转: ${from.path} -> ${to.path}`);
  });
}
```

### 路由元信息

```typescript
// types/router.ts
declare module 'vue-router' {
  interface RouteMeta {
    // 页面标题
    title?: string;
    // 是否需要认证
    requiresAuth?: boolean;
    // 是否缓存组件
    keepAlive?: boolean;
    // 页面图标
    icon?: string;
    // 是否在菜单中隐藏
    hidden?: boolean;
    // 权限代码
    permissions?: string[];
  }
}
```

## 🌐 API 接口

### 接口封装规范

#### HTTP 客户端配置
```typescript
// utils/request.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加请求 ID
    config.headers['X-Request-ID'] = generateRequestId();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data } = response.data;
    
    // 业务成功
    if (code === 0) {
      return response.data;
    }
    
    // 业务失败
    throw new Error(message || '请求失败');
  },
  (error) => {
    // 网络错误处理
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，跳转登录
          router.push('/login');
          break;
        case 403:
          // 无权限
          throw new Error('无权限访问');
        case 404:
          // 资源不存在
          throw new Error('资源不存在');
        case 500:
          // 服务器错误
          throw new Error('服务器错误');
        default:
          throw new Error(data?.message || '请求失败');
      }
    } else {
      // 网络连接错误
      throw new Error('网络连接失败');
    }
  }
);

export default request;
```

#### API 接口定义
```typescript
// api/activity.ts
import request from '@/utils/request';
import type { ActivityModel, ActivityListParams, ActivityListResponse } from '@/types/activity';

// 获取活动列表
export function getActivityList(params?: ActivityListParams): Promise<ActivityListResponse> {
  return request.get('/activity/list', { params });
}

// 获取活动详情
export function getActivityDetail(id: number): Promise<{ data: ActivityModel }> {
  return request.get(`/activity/${id}`);
}

// 创建活动
export function createActivity(data: Partial<ActivityModel>): Promise<{ data: ActivityModel }> {
  return request.post('/activity', data);
}

// 更新活动
export function updateActivity(id: number, data: Partial<ActivityModel>): Promise<{ data: ActivityModel }> {
  return request.put(`/activity/${id}`, data);
}

// 删除活动
export function deleteActivity(id: number): Promise<void> {
  return request.delete(`/activity/${id}`);
}
```

### Mock 数据规范

```typescript
// mock/activity.ts
import type { MockMethod } from 'vite-plugin-mock';
import { Random } from 'mockjs';

// 生成模拟数据
function generateActivityList(count: number = 10) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: Random.ctitle(5, 15),
    description: Random.cparagraph(2, 5),
    image: Random.image('375x200', Random.color(), Random.cword(2, 4)),
    startTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    endTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    location: `${Random.city()}${Random.county()}`,
    price: Random.boolean() ? Random.integer(50, 500) : 'free',
    status: Random.pick(['upcoming', 'ongoing', 'ended']),
    category: Random.pick(['技术', '设计', '产品', '运营']),
    tags: Array.from({ length: Random.integer(1, 3) }, () => Random.cword(2, 4)),
    participantCount: Random.integer(10, 200),
    maxParticipants: Random.integer(50, 300),
    createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
  }));
}

export default [
  // 获取活动列表
  {
    url: '/api/activity/list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, category, location } = query;
      const list = generateActivityList(100);
      
      // 筛选逻辑
      let filteredList = list;
      if (category) {
        filteredList = filteredList.filter(item => item.category === category);
      }
      if (location) {
        filteredList = filteredList.filter(item => item.location.includes(location));
      }
      
      // 分页逻辑
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageList = filteredList.slice(start, end);
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: pageList,
          total: filteredList.length,
          page: Number(page),
          pageSize: Number(pageSize),
        },
      };
    },
  },
  
  // 获取活动详情
  {
    url: '/api/activity/:id',
    method: 'get',
    response: ({ query }) => {
      const { id } = query;
      const activity = generateActivityList(1)[0];
      activity.id = Number(id);
      
      return {
        code: 0,
        message: 'success',
        data: activity,
      };
    },
  },
] as MockMethod[];
```

## 🎨 样式开发

### CSS 架构设计

#### 样式文件组织
```
src/style/
├── index.less              # 样式入口文件
├── variables.less          # CSS 变量定义
├── mixins.less            # 混入函数
├── utils.less             # 工具类
├── reset.less             # 样式重置
├── components/            # 组件样式
│   ├── button.less
│   └── card.less
└── pages/                 # 页面样式
    ├── home.less
    └── activity.less
```

#### CSS 变量定义
```less
// variables.less
:root {
  // 主色调
  --td-brand-color: #0052d9;
  --td-brand-color-light: #266fe8;
  --td-brand-color-dark: #003cab;
  
  // 功能色
  --td-success-color: #00a870;
  --td-warning-color: #ed7b2f;
  --td-error-color: #d54941;
  
  // 文本色
  --td-text-color-primary: rgba(0, 0, 0, 0.9);
  --td-text-color-secondary: rgba(0, 0, 0, 0.6);
  --td-text-color-placeholder: rgba(0, 0, 0, 0.4);
  --td-text-color-disabled: rgba(0, 0, 0, 0.26);
  --td-text-color-anti: #ffffff;
  
  // 背景色
  --td-bg-color-page: #f5f5f5;
  --td-bg-color-container: #ffffff;
  --td-bg-color-component: #f3f3f3;
  
  // 边框色
  --td-border-level-1-color: #e7e7e7;
  --td-border-level-2-color: #eeeeee;
  
  // 阴影
  --td-shadow-1: 0 1px 10px rgba(0, 0, 0, 0.05);
  --td-shadow-2: 0 2px 20px rgba(0, 0, 0, 0.1);
  --td-shadow-3: 0 4px 40px rgba(0, 0, 0, 0.15);
  
  // 圆角
  --td-radius-small: 3px;
  --td-radius-medium: 6px;
  --td-radius-large: 9px;
  --td-radius-round: 50%;
  
  // 间距
  --td-spacer-1: 4px;
  --td-spacer-2: 8px;
  --td-spacer-3: 12px;
  --td-spacer-4: 16px;
  --td-spacer-5: 20px;
  --td-spacer-6: 24px;
  --td-spacer-8: 32px;
  --td-spacer-10: 40px;
  
  // 字体
  --td-font-size-xs: 10px;
  --td-font-size-s: 12px;
  --td-font-size-base: 14px;
  --td-font-size-m: 16px;
  --td-font-size-l: 18px;
  --td-font-size-xl: 20px;
  --td-font-size-xxl: 24px;
  
  // 行高
  --td-line-height-xs: 16px;
  --td-line-height-s: 20px;
  --td-line-height-base: 22px;
  --td-line-height-m: 24px;
  --td-line-height-l: 26px;
  --td-line-height-xl: 28px;
  --td-line-height-xxl: 32px;
}
```

#### 混入函数
```less
// mixins.less

// 文本省略
.text-ellipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 多行文本省略
.text-ellipsis-multiline(@lines: 2) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: @lines;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Flex 布局
.flex-center() {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between() {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// 响应式断点
.mobile(@rules) {
  @media (max-width: 767px) {
    @rules();
  }
}

.tablet(@rules) {
  @media (min-width: 768px) and (max-width: 1023px) {
    @rules();
  }
}

.desktop(@rules) {
  @media (min-width: 1024px) {
    @rules();
  }
}

// 动画
.transition(@property: all, @duration: 0.3s, @timing: ease) {
  transition: @property @duration @timing;
}

// 阴影
.box-shadow(@shadow: var(--td-shadow-1)) {
  box-shadow: @shadow;
}
```

### BEM 命名规范实践

#### 基本结构
```less
// 块 (Block)
.activity-card {
  padding: var(--td-spacer-4);
  border-radius: var(--td-radius-medium);
  background: var(--td-bg-color-container);
  .box-shadow();
  
  // 元素 (Element)
  &__header {
    margin-bottom: var(--td-spacer-3);
  }
  
  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: var(--td-radius-small);
  }
  
  &__content {
    padding: var(--td-spacer-3) 0;
  }
  
  &__title {
    font-size: var(--td-font-size-m);
    font-weight: 600;
    color: var(--td-text-color-primary);
    .text-ellipsis();
  }
  
  &__description {
    margin-top: var(--td-spacer-2);
    font-size: var(--td-font-size-base);
    color: var(--td-text-color-secondary);
    .text-ellipsis-multiline(2);
  }
  
  &__footer {
    .flex-between();
    margin-top: var(--td-spacer-3);
  }
  
  &__price {
    font-size: var(--td-font-size-m);
    font-weight: 600;
    color: var(--td-brand-color);
  }
  
  &__actions {
    display: flex;
    gap: var(--td-spacer-2);
  }
  
  // 修饰符 (Modifier)
  &--featured {
    border: 2px solid var(--td-brand-color);
    
    .activity-card__title {
      color: var(--td-brand-color);
    }
  }
  
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  
  &--compact {
    padding: var(--td-spacer-2);
    
    .activity-card__image {
      height: 120px;
    }
  }
}
```

#### 响应式设计
```less
.activity-card {
  // 移动端样式
  .mobile({
    padding: var(--td-spacer-3);
    
    &__image {
      height: 160px;
    }
    
    &__title {
      font-size: var(--td-font-size-base);
    }
  });
  
  // 平板样式
  .tablet({
    padding: var(--td-spacer-4);
    
    &__image {
      height: 180px;
    }
  });
  
  // 桌面端样式
  .desktop({
    padding: var(--td-spacer-5);
    
    &__image {
      height: 220px;
    }
    
    &:hover {
      .box-shadow(var(--td-shadow-2));
      transform: translateY(-2px);
      .transition(all, 0.2s, ease-out);
    }
  });
}
```

## 🌍 国际化

### 多语言配置

#### 语言包结构
```typescript
// locales/zh-CN.json
{
  "common": {
    "confirm": "确认",
    "cancel": "取消",
    "loading": "加载中...",
    "noData": "暂无数据",
    "networkError": "网络错误",
    "retry": "重试"
  },
  "pages": {
    "home": {
      "title": "首页",
      "hotActivities": "热门活动",
      "allActivities": "全部活动",
      "searchPlaceholder": "搜索活动名称"
    },
    "activity": {
      "title": "活动详情",
      "startTime": "开始时间",
      "endTime": "结束时间",
      "location": "活动地点",
      "price": "活动价格",
      "free": "免费",
      "signUp": "立即报名",
      "favorite": "收藏",
      "share": "分享",
      "participants": "参与人数",
      "description": "活动介绍"
    },
    "order": {
      "title": "订单确认",
      "activityInfo": "活动信息",
      "participantInfo": "参与人信息",
      "totalAmount": "总金额",
      "payNow": "立即支付"
    }
  },
  "components": {
    "activityCard": {
      "viewDetail": "查看详情",
      "soldOut": "已售罄",
      "comingSoon": "即将开始"
    }
  },
  "validation": {
    "required": "此字段为必填项",
    "email": "请输入有效的邮箱地址",
    "phone": "请输入有效的手机号码",
    "minLength": "最少输入 {min} 个字符",
    "maxLength": "最多输入 {max} 个字符"
  }
}
```

#### 国际化工具函数
```typescript
// utils/i18n.ts
import { i18n } from '@/locales';

// 获取当前语言
export function getCurrentLocale(): string {
  return i18n.global.locale.value;
}

// 设置语言
export function setLocale(locale: string): void {
  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);
  document.documentElement.lang = locale;
}

// 格式化消息
export function formatMessage(key: string, values?: Record<string, any>): string {
  return i18n.global.t(key, values);
}

// 日期本地化
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const locale = getCurrentLocale();
  return dayjs(date).locale(locale).format(format);
}

// 数字本地化
export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  const locale = getCurrentLocale();
  return new Intl.NumberFormat(locale, options).format(num);
}

// 货币格式化
export function formatCurrency(amount: number, currency: string = 'CNY'): string {
  const locale = getCurrentLocale();
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}
```

#### 组件中使用国际化
```vue
<template>
  <div class="activity-card">
    <h3>{{ activity.name }}</h3>
    <p>{{ t('pages.activity.startTime') }}: {{ formatDate(activity.startTime) }}</p>
    <p>{{ t('pages.activity.price') }}: {{ formatPrice(activity.price) }}</p>
    <button @click="handleSignUp">
      {{ t('pages.activity.signUp') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatDate, formatCurrency } from '@/utils/i18n';

const { t } = useI18n();

const formatPrice = (price: number | 'free') => {
  if (price === 'free') {
    return t('pages.activity.free');
  }
  return formatCurrency(price);
};
</script>
```

## ⚡ 性能优化

### 代码分割策略

#### 路由级别分割
```typescript
// router/index.ts
const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/Home/index.vue'),
  },
  {
    path: '/activity/:id',
    name: 'ActivityDetail',
    component: () => import('@/pages/Activity/Detail/index.vue'),
  },
];
```

#### 组件级别分割
```vue
<template>
  <div>
    <!-- 异步组件 -->
    <Suspense>
      <template #default>
        <AsyncComponent />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

// 异步加载组件
const AsyncComponent = defineAsyncComponent({
  loader: () => import('@/components/HeavyComponent.vue'),
  loadingComponent: () => import('@/components/Loading.vue'),
  errorComponent: () => import('@/components/Error.vue'),
  delay: 200,
  timeout: 3000,
});
</script>
```

### 图片优化

#### 图片懒加载
```vue
<template>
  <div class="image-container">
    <img
      v-lazy="imageSrc"
      :alt="imageAlt"
      class="lazy-image"
      @load="handleImageLoad"
      @error="handleImageError"
    >
  </div>
</template>

<script setup lang="ts">
// 自定义懒加载指令
const vLazy = {
  mounted(el: HTMLImageElement, binding: any) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.src = binding.value;
          observer.unobserve(el);
        }
      });
    });
    
    observer.observe(el);
  },
};
</script>
```

#### 响应式图片
```vue
<template>
  <picture class="responsive-image">
    <source
      media="(max-width: 767px)"
      :srcset="mobileImage"
    >
    <source
      media="(min-width: 768px)"
      :srcset="desktopImage"
    >
    <img
      :src="defaultImage"
      :alt="imageAlt"
      loading="lazy"
    >
  </picture>
</template>
```

### 虚拟滚动

```vue
<template>
  <div class="virtual-list" :style="{ height: containerHeight + 'px' }">
    <div
      class="virtual-list__phantom"
      :style="{ height: totalHeight + 'px' }"
    ></div>
    
    <div
      class="virtual-list__content"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="virtual-list__item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="item.index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface VirtualListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
}

const props = defineProps<VirtualListProps>();

const scrollTop = ref(0);
const startIndex = computed(() => Math.floor(scrollTop.value / props.itemHeight));
const endIndex = computed(() => Math.min(
  startIndex.value + Math.ceil(props.containerHeight / props.itemHeight) + 1,
  props.items.length
));

const visibleItems = computed(() => 
  props.items.slice(startIndex.value, endIndex.value).map((item, index) => ({
    ...item,
    index: startIndex.value + index,
  }))
);

const totalHeight = computed(() => props.items.length * props.itemHeight);
const offsetY = computed(() => startIndex.value * props.itemHeight);
</script>
```

## 🚀 部署指南

### 构建配置

#### 生产环境构建
```bash
# 构建生产版本
npm run build

# 构建后的文件结构
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
├── images/
└── index.html
```

#### Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx 配置
```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### CI/CD 配置

#### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 监控和日志

#### 错误监控
```typescript
// utils/monitor.ts
interface ErrorInfo {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
}

class ErrorMonitor {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.init();
  }

  private init() {
    // 全局错误捕获
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      });
    });

    // Promise 错误捕获
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      });
    });
  }

  private async reportError(error: ErrorInfo) {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
    } catch (e) {
      console.error('Failed to report error:', e);
    }
  }
}

// 初始化错误监控
if (import.meta.env.PROD) {
  new ErrorMonitor('/api/errors');
}
```

#### 性能监控
```typescript
// utils/performance.ts
class PerformanceMonitor {
  private metrics: Record<string, number> = {};

  // 页面加载性能
  measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        load: navigation.loadEventEnd - navigation.navigationStart,
      };
      
      this.reportMetrics();
    });
  }

  // 自定义性能标记
  mark(name: string) {
    performance.mark(name);
  }

  // 测量性能
  measure(name: string, startMark: string, endMark: string) {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    this.metrics[name] = measure.duration;
  }

  private reportMetrics() {
    // 上报性能数据
    console.log('Performance Metrics:', this.metrics);
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

---

本开发指南涵盖了项目开发的各个方面，从架构设计到部署上线。遵循这些规范和最佳实践，可以确保项目的高质量和可维护性。
