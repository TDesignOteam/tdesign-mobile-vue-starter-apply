# 基于 TDesign Mobile Vue 的现代化移动端活动报名系统

<div align="center">
  <img alt="TDesign Logo" width="300" src="https://tdesign.gtimg.com/starter/brand-logo.svg">
  
  [![License](https://img.shields.io/github/license/TDesignOteam/tdesign-mobile-vue-starter-apply)](./LICENSE)
</div>

 [接口文档](./docs/API.md) | [贡献指南](./CONTRIBUTING.md) | [部署指南](./docs/DEPLOYMENT.md) | [开发指南](./docs/DEVELOPMENT.md)

## 📖 项目介绍

**tdesign-mobile-vue-starter-apply** 是一个功能完整的移动端活动报名系统模板，采用现代化前端技术栈构建。项目基于腾讯 TDesign Mobile Vue 组件库开发，提供了从活动浏览、详情查看、在线报名到订单管理的完整业务流程。

### 🎯 项目特色

- 🚀 **现代技术栈**：Vue 3 + TypeScript + Vite + Pinia
- 📱 **移动端优先**：专为移动设备优化的响应式设计
- 🎨 **设计系统**：基于 TDesign 设计语言，保证视觉一致性
- 🌍 **国际化支持**：内置 i18n 多语言解决方案
- 🔧 **开发体验**：完整的 ESLint + Prettier + Husky 工程化配置
- 📊 **状态管理**：使用 Pinia 进行现代化状态管理
- 🎭 **Mock 数据**：内置 Mock 服务，支持独立开发

## ✨ 功能特性

### 🏠 首页模块
- **活动推荐**：热门活动轮播展示
- **活动列表**：分类浏览所有活动
- **地区筛选**：支持城市/地区切换
- **搜索功能**：快速查找目标活动

### 📋 活动详情
- **详细信息**：活动介绍、时间地点、嘉宾信息
- **图片轮播**：活动现场、嘉宾、会场图片展示
- **评价系统**：用户评价和评分展示
- **交互操作**：收藏、分享、立即报名

### 👤 个人中心
- **用户信息**：个人资料管理
- **报名记录**：已报名活动列表
- **设置选项**：主题切换、语言设置

### 🛒 订单流程
- **确认页面**：订单信息确认
- **支付流程**：模拟支付过程
- **结果页面**：购买成功/失败反馈

### 🔐 用户系统
- **登录注册**：支持手机号/邮箱登录
- **身份验证**：JWT Token 管理
- **权限控制**：路由级别权限验证

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.18.0
- **包管理器**: npm >= 7 / yarn >= 1.22 / pnpm >= 9.15.9

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd tdesign-mobile-vue-starter-apply

# 安装依赖
npm install
# 或使用 yarn
yarn install
# 或使用 pnpm
pnpm install

# 启动开发服务器
npm run dev
# 或
yarn dev
# 或
pnpm dev

# 使用 Mock 数据开发
npm run dev:mock
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 构建站点版本
npm run build:site
```

## 📁 项目架构

```
tdesign-mobile-vue-starter-apply/
├── 📁 mock/                    # Mock 数据服务
├── 📁 public/                  # 静态资源
│   ├── assets/                 # 图片资源
│   └── favicon.ico
├── 📁 src/                     # 源代码目录
│   ├── 📁 api/                 # API 接口层
│   │   ├── list.ts             # 活动相关接口
│   │   └── model/              # 数据模型定义
│   ├── 📁 assets/              # 项目资源
│   │   ├── icons/              # 图标资源
│   │   └── images/             # 图片资源
│   ├── 📁 components/          # 公共组件
│   │   ├── result/             # 结果页组件
│   │   └── layout/             # 布局组件
│   ├── 📁 config/              # 配置文件
│   │   └── consts.ts           # 常量配置
│   ├── 📁 constants/           # 业务常量
│   ├── 📁 hooks/               # 自定义 Hooks
│   ├── 📁 layouts/             # 页面布局
│   ├── 📁 locales/             # 国际化
│   │   ├── index.ts
│   │   ├── zh-CN.json          # 中文语言包
│   │   └── en-US.json          # 英文语言包
│   ├── 📁 pages/               # 页面组件
│   │   ├── 📁 home/            # 首页模块
│   │   │   ├── index/          # 首页主页面
│   │   │   └── region/         # 地区选择页
│   │   ├── 📁 activity/        # 活动详情模块
│   │   ├── 📁 login/           # 登录模块
│   │   ├── 📁 mine/            # 个人中心模块
│   │   │   ├── index/          # 个人主页
│   │   │   └── info/           # 个人信息
│   │   ├── 📁 order/           # 订单模块
│   │   └── 📁 result/          # 结果页模块
│   ├── 📁 router/              # 路由配置
│   │   ├── index.ts            # 路由主配置
│   │   └── modules/            # 路由模块
│   ├── 📁 store/               # 状态管理 (Pinia)
│   │   ├── index.ts            # Store 主入口
│   │   └── modules/            # Store 模块
│   ├── 📁 style/               # 全局样式
│   ├── 📁 types/               # TypeScript 类型定义
│   ├── 📁 utils/               # 工具函数
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 应用入口
├── 📄 .env                     # 环境变量
├── 📄 .env.development         # 开发环境变量
├── 📄 .env.production          # 生产环境变量
├── 📄 .gitignore               # Git 忽略配置
├── 📄 .eslintrc.js             # ESLint 配置
├── 📄 .prettierrc              # Prettier 配置
├── 📄 commitlint.config.js     # Commit 规范配置
├── 📄 tsconfig.json            # TypeScript 配置
├── 📄 vite.config.ts           # Vite 构建配置
└── 📄 package.json             # 项目依赖配置
```

## 🛠 技术栈详解

### 核心框架
- **Vue 3.5.13**: 采用 Composition API，提供更好的 TypeScript 支持
- **TypeScript 5.4.3**: 静态类型检查，提升代码质量和开发体验
- **Vite 6.2.2**: 现代化构建工具，快速的热重载和构建速度

### UI 组件库
- **TDesign Mobile Vue 1.10.1**: 腾讯开源的移动端组件库
- **TDesign Icons Vue Next 0.3.6**: 配套图标库

### 状态管理与路由
- **Pinia 2.1.7**: Vue 3 官方推荐的状态管理库
- **Vue Router 4.3.0**: 官方路由管理器
- **Pinia Plugin Persistedstate 3.2.0**: 状态持久化插件

### 工具库
- **Axios 1.8.4**: HTTP 客户端
- **Day.js 1.11.13**: 轻量级日期处理库
- **Lodash 4.17.21**: JavaScript 实用工具库
- **Vue I18n 9.9.1**: 国际化解决方案
- **VueUse Core 12.3.0**: Vue 组合式 API 工具集

### 开发工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Stylelint**: 样式代码检查
- **Husky**: Git Hooks 管理
- **Commitizen**: 规范化提交信息
- **Lint-staged**: 暂存区代码检查

## 🎨 设计规范

### 组件设计原则

- **单一职责**: 每个组件只负责一个功能
- **可复用性**: 组件设计考虑复用场景
- **可配置性**: 通过 props 提供灵活配置
- **可扩展性**: 预留插槽和事件接口

## 📱 页面功能详解

### 首页 (Home)
**路径**: `/home`

**功能特性**:
- 活动轮播图展示
- 热门活动推荐
- 活动分类筛选
- 地区切换功能
- 下拉刷新和上拉加载

**技术实现**:
- 使用 `t-swiper` 实现轮播图
- Pinia store 管理活动列表状态
- 响应式设计适配不同屏幕

### 活动详情 (Activity Detail)
**路径**: `/activity/:id`

**功能特性**:
- 活动基本信息展示
- 嘉宾和会场图片轮播
- 用户评价和评分
- 底部抽屉式详情面板
- 收藏和分享功能

**技术实现**:
- 动态路由参数获取活动 ID
- 手势操作控制抽屉展开/收起
- 图片懒加载优化性能
- 社交分享 API 集成

### 个人中心 (Mine)
**路径**: `/mine`

**功能特性**:
- 用户头像和基本信息
- 已报名活动列表
- 个人设置选项
- 主题切换功能

**技术实现**:
- 用户状态持久化存储
- 主题动态切换
- 头像上传和裁剪
- 数据懒加载

### 订单确认 (Order Confirm)
**路径**: `/order/confirm`

**功能特性**:
- 活动信息确认
- 报名人员信息填写
- 价格计算和展示
- 支付方式选择

**技术实现**:
- 表单验证和数据校验
- 实时价格计算
- 支付流程模拟
- 订单状态管理

### 结果页面 (Result)
**路径**: `/result`

**功能特性**:
- 购买成功/失败状态展示
- 订单详情信息
- 分享功能
- 快速跳转操作

**技术实现**:
- 状态传递和展示
- 分享组件封装
- 路由跳转优化

## 🔧 开发指南

### 环境配置

项目支持多环境配置，通过 `.env` 文件管理：

```bash
# .env.development
VITE_API_URL_PREFIX=/api
VITE_BASE_URL=/
VITE_APP_TITLE=TDesign 活动报名系统

# .env.production
VITE_API_URL_PREFIX=/api
VITE_BASE_URL=/tdesign-mobile-vue-starter-apply/
VITE_APP_TITLE=TDesign 活动报名系统
```

### 代码规范

#### 组件命名
- 组件文件使用 PascalCase: `ActivityCard.vue`
- 组件注册使用 kebab-case: `<activity-card>`

#### 样式规范
- 使用 Less 预处理器
- 遵循 BEM 命名规范
- 使用 CSS 变量实现主题切换

#### TypeScript 规范
- 严格类型检查
- 接口定义统一管理
- 使用泛型提升代码复用性

### API 接口规范

```typescript
// 接口定义示例
interface ActivityListResponse {
  code: number;
  message: string;
  data: {
    list: ActivityModel[];
    total: number;
  };
}

// 接口调用示例
export const getActivityList = (): Promise<ActivityListResponse> => {
  return request.get('/api/activity/list');
};
```

### 状态管理规范

```typescript
// Store 定义示例
export const useActivityStore = defineStore('activity', {
  state: () => ({
    list: [] as ActivityModel[],
    loading: false,
    currentActivity: null as ActivityModel | null,
  }),
  
  actions: {
    async fetchActivityList() {
      this.loading = true;
      try {
        const response = await getActivityList();
        this.list = response.data.list;
      } finally {
        this.loading = false;
      }
    },
  },
  
  persist: {
    key: 'activity-store',
    storage: localStorage,
  },
});
```

## 📋 可用脚本

```bash
# 开发相关
npm run dev          # 启动开发服务器
npm run dev:mock     # 使用 Mock 数据启动开发服务器
npm run build        # 构建生产版本
npm run build:site   # 构建站点版本
npm run preview      # 预览构建结果

# 代码质量
npm run lint         # 运行 ESLint 检查
npm run lint:fix     # 自动修复 ESLint 问题
npm run stylelint    # 运行样式检查
npm run stylelint:fix # 自动修复样式问题
npm run tsc          # TypeScript 类型检查

# 测试相关
npm run test         # 运行测试 (待实现)
npm run test:coverage # 测试覆盖率 (待实现)

# 其他
npm run prepare      # Husky 初始化
npm run site:preview # 站点预览
```

## 🌍 国际化支持

项目内置完整的国际化解决方案：

### 语言配置
```typescript
// locales/index.ts
import { createI18n } from 'vue-i18n';
import zhCN from './zh-CN.json';
import enUS from './en-US.json';

export const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});
```

### 使用方式
```vue
<template>
  <div>{{ t('pages.home.title') }}</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
```

## 🎯 性能优化

### 构建优化
- **代码分割**: 路由级别的懒加载
- **Tree Shaking**: 自动移除未使用代码
- **资源压缩**: Gzip 压缩和图片优化
- **缓存策略**: 合理的缓存配置

### 运行时优化
- **虚拟滚动**: 长列表性能优化
- **图片懒加载**: 减少初始加载时间
- **防抖节流**: 优化用户交互响应
- **内存管理**: 及时清理事件监听器

## 🔍 调试指南

### 开发工具
- **Vue DevTools**: Vue 组件调试
- **Network 面板**: API 请求监控
- **Console**: 日志输出和错误追踪
- **Performance**: 性能分析

### 常见问题
1. **路由跳转问题**: 检查路由配置和权限
2. **样式不生效**: 确认 CSS 作用域和优先级
3. **API 请求失败**: 检查 Mock 服务和代理配置
4. **状态管理问题**: 确认 Store 的正确使用

## 📚 学习资源

### 官方文档
- [Vue 3 官方文档](https://vuejs.org/)
- [TDesign Mobile Vue](https://tdesign.tencent.com/mobile-vue/overview)
- [Vite 官方文档](https://vitejs.dev/)
- [Pinia 官方文档](https://pinia.vuejs.org/)

### 设计资源
- **设计稿**: [Figma 设计稿](https://codesign.woa.com/s/578083411595522)
- **访问密码**: YFS5

## 🤝 贡献指南

### 提交规范
项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能开发
git commit -m "feat: 添加活动收藏功能"

# 问题修复
git commit -m "fix: 修复活动详情页面加载问题"

# 文档更新
git commit -m "docs: 更新 README 文档"

# 样式调整
git commit -m "style: 优化活动卡片样式"

# 重构代码
git commit -m "refactor: 重构用户状态管理逻辑"
```

### 开发流程
1. Fork 项目到个人仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交代码: `git commit -m "feat: add new feature"`
4. 推送分支: `git push origin feature/new-feature`
5. 创建 Pull Request

## 📄 许可证

本项目基于 [MIT](./LICENSE) 许可证开源。

## 🙏 致谢

感谢以下开源项目和团队：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TDesign](https://tdesign.tencent.com/) - 腾讯开源设计体系
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

---

<div align="center">
  <p>如果这个项目对你有帮助，请给它一个 ⭐️</p>
  <p>Made with ❤️ by TDesign Team</p>
</div>
