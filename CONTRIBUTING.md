# 贡献指南

感谢您对 TDesign 移动端活动报名系统的关注！本文档将指导您如何参与项目开发，包括代码贡献、问题反馈、功能建议等。

## 📋 目录

- [开始之前](#开始之前)
- [开发环境搭建](#开发环境搭建)
- [代码贡献流程](#代码贡献流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [问题反馈](#问题反馈)
- [功能建议](#功能建议)
- [文档贡献](#文档贡献)
- [社区参与](#社区参与)

## 🚀 开始之前

### 行为准则

参与本项目即表示您同意遵守我们的[行为准则](CODE_OF_CONDUCT.md)。我们致力于为所有人提供友好、安全和欢迎的环境。

### 贡献方式

您可以通过以下方式为项目做出贡献：

- 🐛 **报告 Bug**：发现问题并提交详细的错误报告
- 💡 **功能建议**：提出新功能或改进建议
- 💻 **代码贡献**：修复 Bug、实现新功能、优化性能
- 📚 **文档改进**：完善文档、添加示例、翻译内容
- 🎨 **设计优化**：改进 UI/UX 设计
- 🔍 **代码审查**：参与 Pull Request 审查

## 🛠 开发环境搭建

### 系统要求

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 或 **pnpm**: >= 7.0.0 (推荐使用pnpm)
- **Git**: >= 2.20.0

### 克隆项目

```bash
# Fork 项目到您的 GitHub 账户，然后克隆
git clone https://github.com/YOUR_USERNAME/tdesign-mobile-vue-starter-apply.git
cd tdesign-mobile-vue-starter-apply

# 添加上游仓库
git remote add upstream https://github.com/original-org/tdesign-mobile-vue-starter-apply.git
```

### 安装依赖

```bash
# 推荐使用 pnpm
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

### 验证环境

```bash
# 运行测试
pnpm test

# 运行代码检查
pnpm lint

# 运行类型检查
pnpm type-check

# 构建项目
pnpm build
```

## 🔄 代码贡献流程

### 1. 创建分支

```bash
# 确保主分支是最新的
git checkout main
git pull upstream main

# 创建功能分支
git checkout -b feature/your-feature-name

# 或创建修复分支
git checkout -b fix/issue-number
```

### 2. 开发代码

- 遵循项目的[代码规范](#代码规范)
- 编写清晰的代码注释
- 添加必要的测试用例
- 确保代码通过所有检查

### 3. 提交代码

```bash
# 添加文件
git add .

# 提交代码 (遵循提交规范)
git commit -m "feat: add user authentication feature"

# 推送到您的 fork
git push origin feature/your-feature-name
```

### 4. 创建 Pull Request

1. 访问您的 GitHub fork 页面
2. 点击 "New Pull Request"
3. 选择正确的分支
4. 填写 PR 模板
5. 提交 Pull Request

### 5. 代码审查

- 响应审查者的反馈
- 根据建议修改代码
- 保持 PR 更新

### 6. 合并

- PR 通过审查后将被合并
- 删除功能分支

```bash
# 删除本地分支
git branch -d feature/your-feature-name

# 删除远程分支
git push origin --delete feature/your-feature-name
```

## 📝 代码规范

### TypeScript/JavaScript 规范

我们使用 ESLint 和 Prettier 来保持代码风格一致：

```typescript
// ✅ 好的示例
interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

const fetchUserProfile = async (userId: number): Promise<UserProfile> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user profile', error);
    throw error;
  }
};

// ❌ 不好的示例
const fetchUser = async (id) => {
  const res = await api.get('/users/' + id);
  return res.data;
};
```

### Vue 组件规范

```vue
<!-- ✅ 好的示例 -->
<template>
  <div class="user-profile">
    <div class="user-profile__avatar">
      <t-avatar :image="user.avatar" :alt="user.name" />
    </div>
    <div class="user-profile__info">
      <h2 class="user-profile__name">{{ user.name }}</h2>
      <p class="user-profile__email">{{ user.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  user: UserProfile;
}

interface Emits {
  (e: 'update', user: UserProfile): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 组件逻辑
</script>

<style scoped lang="less">
.user-profile {
  display: flex;
  align-items: center;
  padding: 16px;

  &__avatar {
    margin-right: 12px;
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__email {
    font-size: 14px;
    color: var(--td-text-color-secondary);
  }
}
</style>
```

### CSS/Less 规范

遵循 BEM 命名规范：

```less
// ✅ 好的示例
.activity-card {
  border-radius: 8px;
  box-shadow: var(--td-shadow-1);

  &__header {
    padding: 16px;
    border-bottom: 1px solid var(--td-border-level-1-color);
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: var(--td-text-color-primary);

    &--featured {
      color: var(--td-brand-color);
    }
  }

  &__content {
    padding: 16px;
  }

  &--loading {
    opacity: 0.6;
    pointer-events: none;
  }
}

// ❌ 不好的示例
.card {
  .title {
    color: #333;
  }
  
  .content {
    padding: 10px;
  }
}
```

### 文件命名规范

```
src/
├── components/
│   ├── ActivityCard/           # 组件目录使用 PascalCase
│   │   ├── index.vue          # 主组件文件
│   │   ├── index.less         # 样式文件
│   │   └── types.ts           # 类型定义
│   └── UserProfile/
├── pages/
│   ├── activity/              # 页面目录使用 kebab-case
│   │   ├── index/
│   │   └── detail/
├── utils/
│   ├── api.ts                 # 工具文件使用 camelCase
│   ├── storage.ts
│   └── date-format.ts         # 多单词使用 kebab-case
└── types/
    ├── api.ts                 # 类型文件使用 camelCase
    └── user.ts
```

## 📋 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 提交类型

- **feat**: 新功能
- **fix**: Bug 修复
- **docs**: 文档更新
- **style**: 代码格式调整（不影响功能）
- **refactor**: 代码重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动
- **ci**: CI/CD 相关
- **build**: 构建系统或外部依赖变动

### 提交示例

```bash
# 新功能
git commit -m "feat(auth): add user login functionality"

# Bug 修复
git commit -m "fix(activity): resolve date formatting issue"

# 文档更新
git commit -m "docs: update API documentation"

# 重构
git commit -m "refactor(components): extract common button component"

# 性能优化
git commit -m "perf(images): implement lazy loading for activity images"

# 破坏性变更
git commit -m "feat!: change API response format

BREAKING CHANGE: API responses now use camelCase instead of snake_case"
```

### 提交消息规则

- 使用英文编写提交消息
- 首字母小写
- 不要以句号结尾
- 使用祈使语气（"add" 而不是 "added" 或 "adds"）
- 限制首行在 50 字符以内
- 如有必要，在空行后添加详细描述

## 🐛 问题反馈

### 报告 Bug

在提交 Bug 报告之前，请：

1. 搜索现有的 Issues，避免重复报告
2. 确保使用的是最新版本
3. 尝试在不同环境中复现问题

使用 Bug 报告模板：

```markdown
## Bug 描述
简洁清晰地描述遇到的问题。

## 复现步骤
1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

## 期望行为
描述您期望发生的行为。

## 实际行为
描述实际发生的行为。

## 截图
如果适用，添加截图来帮助解释您的问题。

## 环境信息
- 操作系统: [e.g. iOS 16.0, Android 12]
- 浏览器: [e.g. Chrome 108, Safari 16]
- 设备: [e.g. iPhone 14, Samsung Galaxy S22]
- 应用版本: [e.g. 1.2.0]

## 附加信息
添加任何其他相关信息。
```

### 安全问题

如果发现安全漏洞，请不要在公开的 Issues 中报告。请发送邮件至 security@example.com。

## 💡 功能建议

### 提交功能请求

使用功能请求模板：

```markdown
## 功能描述
简洁清晰地描述您想要的功能。

## 问题背景
描述这个功能要解决的问题。是否与某个问题相关？

## 解决方案
描述您希望的解决方案。

## 替代方案
描述您考虑过的任何替代解决方案或功能。

## 附加信息
添加任何其他相关信息或截图。
```

### 功能讨论

- 在 GitHub Discussions 中讨论大型功能
- 参与社区投票和反馈
- 提供设计稿或原型

## 📚 文档贡献

### 文档类型

- **用户文档**: README、使用指南、FAQ
- **开发文档**: API 文档、架构说明、贡献指南
- **代码注释**: 函数、类、复杂逻辑的注释

### 文档规范

```markdown
# 标题使用 H1
## 二级标题使用 H2
### 三级标题使用 H3

- 使用清晰的标题层次
- 添加目录导航
- 使用代码块展示示例
- 添加适当的链接和引用
- 保持内容简洁明了

```typescript
// 代码示例要有注释
const fetchData = async () => {
  // 实现逻辑
};
```

### 中英文混排规范

- 中英文之间添加空格
- 数字与中文之间添加空格
- 使用全角标点符号
- 专有名词保持原样

```markdown
✅ 正确：使用 Vue 3 和 TypeScript 开发
❌ 错误：使用Vue3和TypeScript开发

✅ 正确：支持 iOS 14+ 和 Android 8+
❌ 错误：支持iOS14+和Android8+
```

## 🎨 设计贡献

### 设计原则

- **一致性**: 保持设计风格统一
- **可访问性**: 考虑无障碍访问
- **响应式**: 适配不同屏幕尺寸
- **性能**: 优化加载速度和交互体验

### 设计资源

- 使用 TDesign 设计系统
- 遵循移动端设计规范
- 提供设计稿和交互原型
- 考虑暗色模式适配

### 设计审查

- 提交设计稿到 GitHub Issues
- 参与设计讨论
- 收集用户反馈
- 迭代优化设计

## 🔍 代码审查

### 审查清单

#### 功能性
- [ ] 功能是否按预期工作
- [ ] 是否处理了边界情况
- [ ] 错误处理是否完善
- [ ] 性能是否可接受

#### 代码质量
- [ ] 代码是否清晰易读
- [ ] 是否遵循项目规范
- [ ] 是否有适当的注释
- [ ] 是否有重复代码

#### 测试
- [ ] 是否有足够的测试覆盖
- [ ] 测试是否有意义
- [ ] 是否测试了边界情况

#### 安全性
- [ ] 是否有安全漏洞
- [ ] 输入验证是否充分
- [ ] 敏感信息是否泄露

### 审查反馈

- 提供建设性的反馈
- 解释建议的原因
- 提供具体的改进建议
- 保持友好和专业的语气

```markdown
# ✅ 好的反馈
建议将这个函数拆分为更小的函数，这样可以提高可读性和可测试性。
可以考虑将验证逻辑提取到 `validateUserInput` 函数中。

# ❌ 不好的反馈
这个代码写得不好。
```

## 🏆 贡献者认可

### 贡献者列表

所有贡献者都会被添加到项目的贡献者列表中，包括：

- 代码贡献者
- 文档贡献者
- 设计贡献者
- 测试贡献者
- 问题报告者

## 📞 获取帮助

### 联系方式

- **GitHub Issues**: 报告问题和功能请求
- **GitHub Discussions**: 讨论和提问
- **邮件**: tdesign@tencent.com

### 常见问题

#### Q: 我是新手，可以贡献什么？
A: 可以从以下开始：
- 修复文档中的错别字
- 添加代码注释
- 编写测试用例
- 报告 Bug
- 参与讨论

#### Q: 如何选择要解决的问题？
A: 建议从标有 `good first issue` 或 `help wanted` 的问题开始。

#### Q: 如何保持 fork 同步？
A: 定期执行以下命令：
```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 🎉 感谢

感谢所有为项目做出贡献的开发者！您的每一个贡献都让这个项目变得更好。

---

如果您有任何问题或建议，欢迎通过 GitHub Issues 或邮件与我们联系。让我们一起构建更好的 TDesign Starter！
