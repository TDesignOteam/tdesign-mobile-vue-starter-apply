# 部署指南

本文档详细介绍了 TDesign 移动端活动报名系统的部署流程，包括开发环境、测试环境和生产环境的配置。

## 📋 目录

- [环境要求](#环境要求)
- [开发环境部署](#开发环境部署)
- [测试环境部署](#测试环境部署)
- [生产环境部署](#生产环境部署)
- [性能优化](#性能优化)
- [监控与日志](#监控与日志)
- [故障排查](#故障排查)

## 🔧 环境要求

### 基础环境
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 或 **pnpm**: >= 7.0.0
- **Git**: >= 2.20.0

### 推荐环境
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / macOS 12+
- **内存**: >= 4GB
- **存储**: >= 20GB 可用空间
- **网络**: 稳定的互联网连接

### 浏览器支持
- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88
- 移动端浏览器 (iOS Safari >= 14, Android Chrome >= 88)

## 🚀 开发环境部署

### 1. 克隆项目

```bash
# 使用 HTTPS
git clone https://github.com/your-org/tdesign-mobile-vue-starter-apply.git

# 或使用 SSH
git clone git@github.com:your-org/tdesign-mobile-vue-starter-apply.git

cd tdesign-mobile-vue-starter-apply
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm (推荐)
pnpm install

# 或使用 yarn
yarn install
```

### 3. 环境配置

创建环境配置文件：

```bash
# 复制环境配置模板
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```bash
# 应用配置
VITE_APP_TITLE=TDesign 活动报名系统
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# API 配置
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# 功能开关
VITE_ENABLE_MOCK=true
VITE_ENABLE_VCONSOLE=true
VITE_ENABLE_ANALYTICS=false

# 第三方服务
VITE_MAP_API_KEY=your_map_api_key
VITE_ANALYTICS_ID=your_analytics_id
```

### 4. 启动开发服务器

```bash
# 启动开发服务器
npm run dev

# 或指定端口
npm run dev -- --port 3001

# 或指定主机
npm run dev -- --host 0.0.0.0
```

访问 `http://localhost:5173` 查看应用。

### 5. 开发工具配置

#### VS Code 配置

创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.codeActions.enabled": true,
  "vue.complete.casing.tags": "kebab",
  "vue.complete.casing.props": "camel"
}
```

推荐安装的 VS Code 扩展：

```json
{
  "recommendations": [
    "vue.volar",
    "vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## 🧪 测试环境部署

### 1. 构建测试版本

```bash
# 构建测试环境
npm run build:test

# 或使用环境变量
NODE_ENV=test npm run build
```

### 2. 测试环境配置

创建 `.env.test` 文件：

```bash
# 应用配置
VITE_APP_TITLE=TDesign 活动报名系统 (测试)
VITE_APP_ENV=test

# API 配置
VITE_API_BASE_URL=https://api-test.example.com/api
VITE_ENABLE_MOCK=false

# 功能开关
VITE_ENABLE_VCONSOLE=true
VITE_ENABLE_ANALYTICS=true
```

### 3. 部署到测试服务器

#### 使用 Nginx

```nginx
# /etc/nginx/sites-available/tdesign-test
server {
    listen 80;
    server_name test.example.com;
    
    root /var/www/tdesign-test/dist;
    index index.html;
    
    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 处理 SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API 代理
    location /api/ {
        proxy_pass https://api-test.example.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 部署脚本

创建 `scripts/deploy-test.sh`：

```bash
#!/bin/bash

set -e

echo "🚀 开始部署测试环境..."

# 1. 构建项目
echo "📦 构建项目..."
npm run build:test

# 2. 备份当前版本
echo "💾 备份当前版本..."
ssh user@test-server "cp -r /var/www/tdesign-test /var/www/tdesign-test-backup-$(date +%Y%m%d%H%M%S)"

# 3. 上传新版本
echo "📤 上传新版本..."
rsync -avz --delete dist/ user@test-server:/var/www/tdesign-test/

# 4. 重启服务
echo "🔄 重启 Nginx..."
ssh user@test-server "sudo systemctl reload nginx"

# 5. 健康检查
echo "🔍 健康检查..."
if curl -f https://test.example.com/health; then
    echo "✅ 部署成功！"
else
    echo "❌ 部署失败，正在回滚..."
    ssh user@test-server "rm -rf /var/www/tdesign-test && mv /var/www/tdesign-test-backup-* /var/www/tdesign-test"
    exit 1
fi
```

## 🌐 生产环境部署

### 1. 生产环境配置

创建 `.env.production` 文件：

```bash
# 应用配置
VITE_APP_TITLE=TDesign 活动报名系统
VITE_APP_ENV=production

# API 配置
VITE_API_BASE_URL=https://api.example.com/api
VITE_ENABLE_MOCK=false

# 功能开关
VITE_ENABLE_VCONSOLE=false
VITE_ENABLE_ANALYTICS=true

# 性能配置
VITE_BUILD_SOURCEMAP=false
VITE_BUILD_MINIFY=true
```

### 2. 构建生产版本

```bash
# 构建生产环境
npm run build

# 预览构建结果
npm run preview
```

### 3. 生产服务器配置

#### Nginx 配置

```nginx
# /etc/nginx/sites-available/tdesign-prod
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL 配置
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    root /var/www/tdesign-prod/dist;
    index index.html;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 启用 Brotli 压缩 (如果支持)
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 处理 SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API 代理
    location /api/ {
        proxy_pass https://api.example.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时配置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # 健康检查端点
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
```

### 4. 生产部署脚本

创建 `scripts/deploy-prod.sh`：

```bash
#!/bin/bash

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
DEPLOY_USER="deploy"
PROD_SERVER="prod.example.com"
DEPLOY_PATH="/var/www/tdesign-prod"
BACKUP_PATH="/var/backups/tdesign"

echo -e "${GREEN}🚀 开始生产环境部署...${NC}"

# 1. 预检查
echo -e "${YELLOW}🔍 执行预检查...${NC}"
npm run lint
npm run type-check
npm test

# 2. 构建项目
echo -e "${YELLOW}📦 构建生产版本...${NC}"
npm run build

# 3. 创建备份
echo -e "${YELLOW}💾 创建备份...${NC}"
BACKUP_NAME="tdesign-backup-$(date +%Y%m%d%H%M%S)"
ssh $DEPLOY_USER@$PROD_SERVER "mkdir -p $BACKUP_PATH && cp -r $DEPLOY_PATH $BACKUP_PATH/$BACKUP_NAME"

# 4. 上传新版本
echo -e "${YELLOW}📤 上传新版本...${NC}"
rsync -avz --delete --exclude='.env*' dist/ $DEPLOY_USER@$PROD_SERVER:$DEPLOY_PATH/

# 5. 更新配置
echo -e "${YELLOW}⚙️ 更新配置...${NC}"
scp .env.production $DEPLOY_USER@$PROD_SERVER:$DEPLOY_PATH/.env

# 6. 重启服务
echo -e "${YELLOW}🔄 重启服务...${NC}"
ssh $DEPLOY_USER@$PROD_SERVER "sudo systemctl reload nginx"

# 7. 健康检查
echo -e "${YELLOW}🔍 执行健康检查...${NC}"
sleep 5

if curl -f https://example.com/health; then
    echo -e "${GREEN}✅ 部署成功！${NC}"
    
    # 清理旧备份 (保留最近5个)
    ssh $DEPLOY_USER@$PROD_SERVER "cd $BACKUP_PATH && ls -t | tail -n +6 | xargs -r rm -rf"
else
    echo -e "${RED}❌ 部署失败，正在回滚...${NC}"
    ssh $DEPLOY_USER@$PROD_SERVER "rm -rf $DEPLOY_PATH && cp -r $BACKUP_PATH/$BACKUP_NAME $DEPLOY_PATH"
    ssh $DEPLOY_USER@$PROD_SERVER "sudo systemctl reload nginx"
    exit 1
fi

echo -e "${GREEN}🎉 生产环境部署完成！${NC}"
```

## ⚡ 性能优化

### 1. 构建优化

#### Vite 配置优化

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // 启用 rollup 优化
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          tdesign: ['tdesign-mobile-vue'],
          utils: ['dayjs', 'lodash-es'],
        },
      },
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 生成 sourcemap (生产环境可关闭)
    sourcemap: process.env.NODE_ENV !== 'production',
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
      },
    },
  },
  
  // 预构建优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'tdesign-mobile-vue'],
  },
});
```

### 2. 代码分割

```typescript
// 路由懒加载
const routes = [
  {
    path: '/',
    component: () => import('@/pages/home/index.vue'),
  },
  {
    path: '/activity/:id',
    component: () => import('@/pages/activity/index/index.vue'),
  },
];

// 组件懒加载
const LazyComponent = defineAsyncComponent(() => import('@/components/Heavy.vue'));
```

### 3. 资源优化

```typescript
// 图片懒加载
import { useIntersectionObserver } from '@vueuse/core';

const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      // 加载图片
      stop();
    }
  },
);
```

### 4. 缓存策略

```nginx
# Nginx 缓存配置
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}

location ~* \.(png|jpg|jpeg|gif|ico|svg)$ {
    expires 6M;
    add_header Cache-Control "public";
}
```

## 📊 监控与日志

### 1. 应用监控

#### 集成 Sentry

```typescript
// main.ts
import * as Sentry from '@sentry/vue';

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 1.0,
});
```

#### 性能监控

```typescript
// utils/performance.ts
export function trackPerformance() {
  // 页面加载时间
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    // 发送到监控服务
    sendMetric('page_load_time', loadTime);
  });
  
  // 首次内容绘制
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        sendMetric('fcp', entry.startTime);
      }
    }
  }).observe({ entryTypes: ['paint'] });
}
```

### 2. 日志配置

#### 前端日志

```typescript
// utils/logger.ts
class Logger {
  private level: string;
  
  constructor() {
    this.level = import.meta.env.VITE_LOG_LEVEL || 'info';
  }
  
  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.log(`[INFO] ${new Date().toISOString()} ${message}`, data);
      this.sendToServer('info', message, data);
    }
  }
  
  error(message: string, error?: Error) {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${new Date().toISOString()} ${message}`, error);
      this.sendToServer('error', message, error);
    }
  }
  
  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }
  
  private sendToServer(level: string, message: string, data?: any) {
    if (import.meta.env.PROD) {
      // 发送到日志服务
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, message, data, timestamp: Date.now() }),
      });
    }
  }
}

export const logger = new Logger();
```

### 3. Nginx 日志

```nginx
# 自定义日志格式
log_format detailed '$remote_addr - $remote_user [$time_local] '
                   '"$request" $status $body_bytes_sent '
                   '"$http_referer" "$http_user_agent" '
                   '$request_time $upstream_response_time';

access_log /var/log/nginx/access.log detailed;
```

## 🔧 故障排查

### 1. 常见问题

#### 构建失败
```bash
# 清理缓存
npm run clean
rm -rf node_modules package-lock.json
npm install

# 检查 Node.js 版本
node --version
npm --version
```

#### 部署失败
```bash
# 检查服务器状态
systemctl status nginx
journalctl -u nginx -f

# 检查磁盘空间
df -h

# 检查内存使用
free -h
```

#### 性能问题
```bash
# 分析构建产物
npm run build -- --analyze

# 检查网络请求
curl -w "@curl-format.txt" -o /dev/null -s "https://example.com"
```

### 2. 调试工具

#### 开发环境调试

```typescript
// 开启 Vue DevTools
if (import.meta.env.DEV) {
  app.config.performance = true;
}

// 开启 vConsole (移动端)
if (import.meta.env.VITE_ENABLE_VCONSOLE === 'true') {
  import('vconsole').then(({ default: VConsole }) => {
    new VConsole();
  });
}
```

#### 生产环境调试

```typescript
// 错误边界
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info);
  // 发送到错误监控服务
  Sentry.captureException(err);
};
```

### 3. 健康检查

创建 `scripts/health-check.sh`：

```bash
#!/bin/bash

# 检查应用是否正常运行
check_app() {
    local url="$1"
    local expected_status="$2"
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" = "$expected_status" ]; then
        echo "✅ $url 正常 (状态码: $status)"
        return 0
    else
        echo "❌ $url 异常 (状态码: $status)"
        return 1
    fi
}

# 检查各个端点
check_app "https://example.com/health" "200"
check_app "https://example.com/" "200"
check_app "https://example.com/api/health" "200"

# 检查 SSL 证书
ssl_expiry=$(openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
echo "🔒 SSL 证书到期时间: $ssl_expiry"
```

---

本部署指南涵盖了从开发到生产的完整部署流程，包括性能优化、监控配置和故障排查。遵循这些最佳实践可以确保应用的稳定运行和高性能表现。
