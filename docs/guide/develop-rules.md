# 开发规范

为了维护项目的代码质量，项目中内置了代码检测质量检查工具 `ESlint`，并添加了 `vscode` 相关配置，将格式化任务完全交给 `ESLint`。

同时，也推荐您在开发过程中遵循提交规范，以保持项目仓库的分支、提交信息的清晰整洁。

## 代码编写规范

### ESlint

`ESlint` 可以用来检查代码质量和风格问题。

项目中已内置了 `.eslint.config.mjs` 文件，使用 `antfu/eslint-config` 规则集，遵循单引号、无分号等现代 `JavaScript` 风格。

您可以通过以下命令来进行代码检查和自动修复。在 `pre-commit` 的 `git hook` 中，项目也内置了检查指令，帮助您在提交代码前发现问题。

```bash
# 代码检查
npm run lint

# 自动修复问题
npm run lint:fix
```

## commit 规范

推荐使用 `Conventional Commits` 规范作为您的 `commit message` 的格式。
