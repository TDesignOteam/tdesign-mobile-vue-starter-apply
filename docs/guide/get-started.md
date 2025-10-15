# 快速开始

## 前置准备

- [Node.js](https://nodejs.org/) ≥ 18（推荐使用 20+）
- 包管理器：`npm`, `yarn`, 或 `pnpm`

## 获取代码

```sh
git clone https://github.com/TDesignOteam/tdesign-mobile-vue-starter-apply
cd tdesign-mobile-vue-starter-apply
```

## 安装依赖

::: code-group

```sh [npm]
$ npm install
```

```sh [pnpm]
$ pnpm install
```

```sh [yarn]
$ yarn
```

:::

## 运行

::: code-group

```sh [npm]
$ npm run dev
```

```sh [pnpm]
$ pnpm dev
```

```sh [yarn]
$ yarn dev
```

:::

开发服务会运行在 `http://localhost:5173` 上。在浏览器中访问 `URL` 以查看运行情况吧！

## 构建与预览

- 生产构建：

::: code-group

```sh [npm]
$ npm run build
```

```sh [pnpm]
$ pnpm build
```

```sh [yarn]
$ yarn build
```

:::

- 本地预览：

::: code-group

```sh [npm]
$ npm run preview
```

```sh [pnpm]
$ pnpm preview
```

```sh [yarn]
$ yarn preview
```

:::

## 文档站点

- 启动文档开发：

::: code-group

```sh [npm]
$ npm run docs:dev
```

```sh [pnpm]
$ pnpm docs:dev
```

```sh [yarn]
$ yarn docs:dev
```

:::

- 构建文档：

::: code-group

```sh [npm]
$ npm run docs:build
```

```sh [pnpm]
$ pnpm docs:build
```

```sh [yarn]
$ yarn docs:build
```

:::

- 预览文档站：

::: code-group

```sh [npm]
$ npm run docs:preview
```

```sh [pnpm]
$ pnpm docs:preview
```

```sh [yarn]
$ yarn docs:preview
```

:::

## 环境要求

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 110+                                                                                                                                                                                                            | 104+                                                                                                                                                                                                              | 110+                                                                                                                                                                                                          | 16+                                                                                                                                                                                                           |

## 下一步

- 想要进一步了解项目是如何组织代码并保持一致性的，请继续阅读[项目结构](./develop.md#项目结构)。

- 要了解有关项目的配置信息，请参见指南的“[环境变量](./develop.md#环境变量)”、“[全局配置](./develop.md#全局配置)”部分。

- 要理解项目如何处理数据请求，请查看[发起请求](./request-data.md#发起请求)、[Mock 服务](./request-data.md#mock-服务)、[错误处理](./request-data.md#统一错误处理与提示)。

- 如果想进一步探索路由与页面配置，参见[路由配置](./router.md)。
