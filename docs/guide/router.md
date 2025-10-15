# 路由配置

本项目使用 `unplugin-vue-router` 实现基于文件系统的自动路由，只需在 `src/pages` 目录新增/修改页面文件，即可自动生效。

## 路由文件结构

`src/pages` 目录映射为路由：

```bash
src/pages/
├── activity-detail/[id].vue  # 活动详情（/activity-detail/:id）
├── buy-confirm/[id].vue      # 确认订单（/buy-confirm/:id）
├── buy-result/[id].vue       # 购买结果（/buy-result/:id）
├── main/
│   ├── base/index.vue        # 首页（/main/base/）
│   └── user/index.vue        # 我的（/main/user/）
├── person-info/index.vue     # 个人信息 (/person-info)
├── select-location/index.vue # 选择城市 (/select-location)
├── [...all].vue              # 404 兜底页
├── index.vue                 # 入口页（项目中会重定向到 /main/base/）
└── main.vue                  # 布局页（含顶部 Navbar、底部 TabBar）
```

## 动态路由

- 使用方括号声明参数：`[id].vue`
- 访问示例：`/activity-detail/123`、`/buy-confirm/456`
- 在组件中通过 `useRoute()` 获取参数：`route.params.id`

## 404 兜底页

- 捕捉未定义路由页面访问
- 提供“返回首页/返回上一页”操作
