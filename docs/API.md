# API 接口文档

本文档详细描述了 TDesign 移动端活动报名系统的 API 接口规范，包括请求格式、响应格式、错误处理等。

## 📋 目录

- [接口规范](#接口规范)
- [认证机制](#认证机制)
- [数据模型](#数据模型)
- [活动相关接口](#活动相关接口)
- [用户相关接口](#用户相关接口)
- [订单相关接口](#订单相关接口)
- [文件上传接口](#文件上传接口)
- [错误码说明](#错误码说明)
- [Mock 数据](#mock-数据)

## 🔧 接口规范

### 基础信息

- **Base URL**: `https://api.example.com`
- **API Version**: `v1`
- **Content-Type**: `application/json`
- **字符编码**: `UTF-8`

### 请求格式

#### HTTP 方法
- `GET`: 获取资源
- `POST`: 创建资源
- `PUT`: 更新资源（完整更新）
- `PATCH`: 更新资源（部分更新）
- `DELETE`: 删除资源

#### 请求头
```http
Content-Type: application/json
Authorization: Bearer <access_token>
X-Request-ID: <unique_request_id>
Accept-Language: zh-CN,en-US
```

### 响应格式

#### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 具体数据
  },
  "timestamp": 1640995200000,
  "requestId": "req_123456789"
}
```

#### 错误响应
```json
{
  "code": 40001,
  "message": "参数错误",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ],
  "timestamp": 1640995200000,
  "requestId": "req_123456789"
}
```

#### 分页响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🔐 认证机制

### JWT Token 认证

#### 获取 Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 响应
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

#### 使用 Token
```http
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 刷新 Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📊 数据模型

### 活动模型 (Activity)
```typescript
interface ActivityModel {
  id: number;                    // 活动ID
  name: string;                  // 活动名称
  description: string;           // 活动描述
  content?: string;              // 活动详细内容
  category: string;              // 活动分类
  tags: string[];               // 活动标签
  
  // 时间信息
  startTime: string;            // 开始时间 (ISO 8601)
  endTime: string;              // 结束时间 (ISO 8601)
  registrationDeadline: string; // 报名截止时间
  
  // 地点信息
  location: string;             // 活动地点
  address?: string;             // 详细地址
  coordinates?: {               // 地理坐标
    latitude: number;
    longitude: number;
  };
  
  // 价格信息
  price: number | 'free';       // 活动价格
  priceRange?: {                // 价格区间
    min: number;
    max: number;
  };
  currency: string;             // 货币单位
  
  // 参与信息
  maxParticipants: number;      // 最大参与人数
  currentParticipants: number;  // 当前参与人数
  minParticipants?: number;     // 最少参与人数
  
  // 状态信息
  status: 'draft' | 'published' | 'ongoing' | 'ended' | 'cancelled';
  isPublic: boolean;            // 是否公开
  requiresApproval: boolean;    // 是否需要审核
  
  // 媒体资源
  coverImage: string;           // 封面图片
  images: string[];             // 活动图片
  videos?: string[];            // 活动视频
  
  // 组织者信息
  organizer: {
    id: number;
    name: string;
    avatar?: string;
    description?: string;
  };
  
  // 嘉宾信息
  guests?: Array<{
    id: number;
    name: string;
    title: string;
    avatar: string;
    bio?: string;
  }>;
  
  // 会场信息
  venues?: Array<{
    id: number;
    name: string;
    description?: string;
    image: string;
    capacity?: number;
  }>;
  
  // 评价信息
  rating: number;               // 平均评分
  reviewCount: number;          // 评价数量
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
}
```

### 用户模型 (User)
```typescript
interface UserModel {
  id: number;
  username: string;
  email: string;
  phone?: string;
  
  // 个人信息
  profile: {
    nickname: string;
    avatar?: string;
    gender?: 'male' | 'female' | 'other';
    birthday?: string;
    bio?: string;
    location?: string;
  };
  
  // 账户信息
  status: 'active' | 'inactive' | 'banned';
  emailVerified: boolean;
  phoneVerified: boolean;
  
  // 偏好设置
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  
  // 统计信息
  stats: {
    activitiesJoined: number;
    activitiesOrganized: number;
    totalSpent: number;
  };
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}
```

### 订单模型 (Order)
```typescript
interface OrderModel {
  id: string;                   // 订单ID
  orderNumber: string;          // 订单号
  
  // 活动信息
  activity: {
    id: number;
    name: string;
    startTime: string;
    location: string;
  };
  
  // 用户信息
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  
  // 参与者信息
  participants: Array<{
    name: string;
    phone: string;
    email: string;
    idCard?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  }>;
  
  // 价格信息
  pricing: {
    unitPrice: number;
    quantity: number;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    currency: string;
  };
  
  // 订单状态
  status: 'pending' | 'paid' | 'confirmed' | 'cancelled' | 'refunded';
  paymentStatus: 'unpaid' | 'paid' | 'refunding' | 'refunded';
  
  // 支付信息
  payment?: {
    method: 'wechat' | 'alipay' | 'credit_card';
    transactionId: string;
    paidAt: string;
  };
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
  expiredAt: string;            // 订单过期时间
}
```

## 🎯 活动相关接口

### 获取活动列表

```http
GET /api/activities
```

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 10，最大 50 |
| category | string | 否 | 活动分类 |
| location | string | 否 | 活动地点 |
| startDate | string | 否 | 开始日期筛选 (YYYY-MM-DD) |
| endDate | string | 否 | 结束日期筛选 (YYYY-MM-DD) |
| priceMin | number | 否 | 最低价格 |
| priceMax | number | 否 | 最高价格 |
| status | string | 否 | 活动状态 |
| keyword | string | 否 | 搜索关键词 |
| sortBy | string | 否 | 排序字段 (startTime, price, popularity) |
| sortOrder | string | 否 | 排序方向 (asc, desc) |

#### 响应示例
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "Vue.js 技术分享会",
        "description": "深入探讨 Vue.js 3.0 的新特性和最佳实践",
        "category": "技术",
        "tags": ["Vue.js", "前端", "技术分享"],
        "startTime": "2024-02-01T14:00:00Z",
        "endTime": "2024-02-01T17:00:00Z",
        "location": "深圳市南山区",
        "price": 99,
        "currency": "CNY",
        "maxParticipants": 100,
        "currentParticipants": 45,
        "status": "published",
        "coverImage": "https://example.com/images/vue-event.jpg",
        "organizer": {
          "id": 1,
          "name": "技术社区",
          "avatar": "https://example.com/avatars/organizer.jpg"
        },
        "rating": 4.8,
        "reviewCount": 23,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 156,
      "totalPages": 16,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 获取活动详情

```http
GET /api/activities/{id}
```

#### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 活动ID |

#### 响应示例
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "name": "Vue.js 技术分享会",
    "description": "深入探讨 Vue.js 3.0 的新特性和最佳实践",
    "content": "<p>活动详细内容...</p>",
    "category": "技术",
    "tags": ["Vue.js", "前端", "技术分享"],
    "startTime": "2024-02-01T14:00:00Z",
    "endTime": "2024-02-01T17:00:00Z",
    "registrationDeadline": "2024-01-30T23:59:59Z",
    "location": "深圳市南山区科技园",
    "address": "深圳市南山区科技园南区R2-A栋",
    "coordinates": {
      "latitude": 22.5431,
      "longitude": 113.9344
    },
    "price": 99,
    "currency": "CNY",
    "maxParticipants": 100,
    "currentParticipants": 45,
    "status": "published",
    "isPublic": true,
    "requiresApproval": false,
    "coverImage": "https://example.com/images/vue-event-cover.jpg",
    "images": [
      "https://example.com/images/vue-event-1.jpg",
      "https://example.com/images/vue-event-2.jpg"
    ],
    "organizer": {
      "id": 1,
      "name": "技术社区",
      "avatar": "https://example.com/avatars/organizer.jpg",
      "description": "专注于前端技术分享的社区"
    },
    "guests": [
      {
        "id": 1,
        "name": "张三",
        "title": "Vue.js 核心团队成员",
        "avatar": "https://example.com/avatars/guest1.jpg",
        "bio": "Vue.js 资深开发者，拥有5年前端开发经验"
      }
    ],
    "venues": [
      {
        "id": 1,
        "name": "主会场",
        "description": "可容纳100人的现代化会议室",
        "image": "https://example.com/images/venue1.jpg",
        "capacity": 100
      }
    ],
    "rating": 4.8,
    "reviewCount": 23,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

### 创建活动

```http
POST /api/activities
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### 请求体
```json
{
  "name": "Vue.js 技术分享会",
  "description": "深入探讨 Vue.js 3.0 的新特性和最佳实践",
  "content": "<p>活动详细内容...</p>",
  "category": "技术",
  "tags": ["Vue.js", "前端", "技术分享"],
  "startTime": "2024-02-01T14:00:00Z",
  "endTime": "2024-02-01T17:00:00Z",
  "registrationDeadline": "2024-01-30T23:59:59Z",
  "location": "深圳市南山区科技园",
  "address": "深圳市南山区科技园南区R2-A栋",
  "price": 99,
  "maxParticipants": 100,
  "isPublic": true,
  "requiresApproval": false,
  "coverImage": "https://example.com/images/vue-event-cover.jpg"
}
```

#### 响应示例
```json
{
  "code": 0,
  "message": "活动创建成功",
  "data": {
    "id": 123,
    "name": "Vue.js 技术分享会",
    "status": "draft",
    "createdAt": "2024-01-25T10:00:00Z"
  }
}
```

### 更新活动

```http
PUT /api/activities/{id}
Authorization: Bearer <access_token>
Content-Type: application/json
```

### 删除活动

```http
DELETE /api/activities/{id}
Authorization: Bearer <access_token>
```

### 获取活动评价

```http
GET /api/activities/{id}/reviews
```

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 10 |
| rating | number | 否 | 评分筛选 (1-5) |

#### 响应示例
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "nickname": "用户A",
          "avatar": "https://example.com/avatars/user1.jpg"
        },
        "rating": 5,
        "content": "活动内容很棒，讲师专业，收获很大！",
        "images": [
          "https://example.com/reviews/review1.jpg"
        ],
        "createdAt": "2024-02-02T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 23,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "averageRating": 4.8,
      "totalReviews": 23,
      "ratingDistribution": {
        "5": 15,
        "4": 6,
        "3": 2,
        "2": 0,
        "1": 0
      }
    }
  }
}
```

## 👤 用户相关接口

### 用户注册

```http
POST /api/auth/register
Content-Type: application/json
```

#### 请求体
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "+86 138 0013 8000",
  "nickname": "用户昵称",
  "inviteCode": "ABC123"
}
```

#### 响应示例
```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 123,
      "username": "user123",
      "email": "user@example.com",
      "profile": {
        "nickname": "用户昵称"
      },
      "status": "active",
      "createdAt": "2024-01-25T10:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 用户登录

```http
POST /api/auth/login
Content-Type: application/json
```

#### 请求体
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

### 获取用户信息

```http
GET /api/user/profile
Authorization: Bearer <access_token>
```

#### 响应示例
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 123,
    "username": "user123",
    "email": "user@example.com",
    "phone": "+86 138 0013 8000",
    "profile": {
      "nickname": "用户昵称",
      "avatar": "https://example.com/avatars/user123.jpg",
      "gender": "male",
      "birthday": "1990-01-01",
      "bio": "这是我的个人简介",
      "location": "深圳市"
    },
    "status": "active",
    "emailVerified": true,
    "phoneVerified": true,
    "preferences": {
      "language": "zh-CN",
      "timezone": "Asia/Shanghai",
      "notifications": {
        "email": true,
        "sms": false,
        "push": true
      }
    },
    "stats": {
      "activitiesJoined": 15,
      "activitiesOrganized": 3,
      "totalSpent": 1580
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-25T10:00:00Z"
  }
}
```

### 更新用户信息

```http
PUT /api/user/profile
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### 请求体
```json
{
  "profile": {
    "nickname": "新昵称",
    "bio": "更新后的个人简介",
    "location": "北京市"
  },
  "preferences": {
    "language": "en-US",
    "notifications": {
      "email": false,
      "push": true
    }
  }
}
```

### 获取用户活动列表

```http
GET /api/user/activities
Authorization: Bearer <access_token>
```

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 活动类型 (joined, organized, favorited) |
| status | string | 否 | 活动状态 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

## 🛒 订单相关接口

### 创建订单

```http
POST /api/orders
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### 请求体
```json
{
  "activityId": 123,
  "participants": [
    {
      "name": "张三",
      "phone": "+86 138 0013 8000",
      "email": "zhangsan@example.com",
      "idCard": "440301199001011234",
      "emergencyContact": {
        "name": "李四",
        "phone": "+86 139 0013 9000",
        "relationship": "朋友"
      }
    }
  ],
  "couponCode": "DISCOUNT10",
  "remarks": "特殊需求说明"
}
```

#### 响应示例
```json
{
  "code": 0,
  "message": "订单创建成功",
  "data": {
    "id": "order_123456789",
    "orderNumber": "ORD20240125001",
    "activity": {
      "id": 123,
      "name": "Vue.js 技术分享会",
      "startTime": "2024-02-01T14:00:00Z",
      "location": "深圳市南山区"
    },
    "participants": [
      {
        "name": "张三",
        "phone": "+86 138 0013 8000",
        "email": "zhangsan@example.com"
      }
    ],
    "pricing": {
      "unitPrice": 99,
      "quantity": 1,
      "subtotal": 99,
      "discount": 10,
      "tax": 0,
      "total": 89,
      "currency": "CNY"
    },
    "status": "pending",
    "paymentStatus": "unpaid",
    "createdAt": "2024-01-25T10:00:00Z",
    "expiredAt": "2024-01-25T10:30:00Z"
  }
}
```

### 获取订单详情

```http
GET /api/orders/{id}
Authorization: Bearer <access_token>
```

### 获取订单列表

```http
GET /api/orders
Authorization: Bearer <access_token>
```

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 订单状态 |
| paymentStatus | string | 否 | 支付状态 |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

### 支付订单

```http
POST /api/orders/{id}/pay
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### 请求体
```json
{
  "paymentMethod": "wechat",
  "returnUrl": "https://example.com/payment/return",
  "notifyUrl": "https://example.com/payment/notify"
}
```

#### 响应示例
```json
{
  "code": 0,
  "message": "支付请求成功",
  "data": {
    "paymentId": "pay_123456789",
    "paymentUrl": "https://pay.example.com/pay?id=pay_123456789",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "expiresAt": "2024-01-25T10:30:00Z"
  }
}
```

### 取消订单

```http
POST /api/orders/{id}/cancel
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### 请求体
```json
{
  "reason": "时间冲突，无法参加"
}
```

## 📁 文件上传接口

### 上传图片

```http
POST /api/upload/image
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

#### 请求体
```
file: <image_file>
type: avatar|activity|review
```

#### 响应示例
```json
{
  "code": 0,
  "message": "上传成功",
  "data": {
    "url": "https://example.com/images/uploaded/image123.jpg",
    "filename": "image123.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080
  }
}
```

### 批量上传图片

```http
POST /api/upload/images
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

#### 请求体
```
files[]: <image_file_1>
files[]: <image_file_2>
type: activity
```

## ❌ 错误码说明

### 通用错误码
| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 10001 | 系统错误 |
| 10002 | 参数错误 |
| 10003 | 数据不存在 |
| 10004 | 数据已存在 |
| 10005 | 操作失败 |

### 认证相关错误码
| 错误码 | 说明 |
|--------|------|
| 20001 | 未登录 |
| 20002 | 登录已过期 |
| 20003 | 无权限 |
| 20004 | 账号被禁用 |
| 20005 | 密码错误 |
| 20006 | 验证码错误 |

### 业务相关错误码
| 错误码 | 说明 |
|--------|------|
| 30001 | 活动不存在 |
| 30002 | 活动已结束 |
| 30003 | 活动人数已满 |
| 30004 | 报名已截止 |
| 30005 | 重复报名 |
| 30006 | 订单不存在 |
| 30007 | 订单已过期 |
| 30008 | 支付失败 |
| 30009 | 退款失败 |

### 文件上传错误码
| 错误码 | 说明 |
|--------|------|
| 40001 | 文件格式不支持 |
| 40002 | 文件大小超限 |
| 40003 | 上传失败 |

## 🎭 Mock 数据

### Mock 服务配置

项目使用 `vite-plugin-mock` 提供 Mock 数据服务，配置文件位于 `mock/` 目录。

#### 活动列表 Mock
```typescript
// mock/activity.ts
export default [
  {
    url: '/api/activities',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, category, keyword } = query;
      
      // 生成模拟数据
      const activities = generateActivities(100);
      
      // 筛选逻辑
      let filteredActivities = activities;
      if (category) {
        filteredActivities = filteredActivities.filter(
          item => item.category === category
        );
      }
      if (keyword) {
        filteredActivities = filteredActivities.filter(
          item => item.name.includes(keyword) || 
                  item.description.includes(keyword)
        );
      }
      
      // 分页逻辑
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredActivities.slice(start, end);
      
      return {
        code: 0,
        message: 'success',
        data: {
          list,
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            total: filteredActivities.length,
            totalPages: Math.ceil(filteredActivities.length / pageSize),
            hasNext: end < filteredActivities.length,
            hasPrev: page > 1,
          },
        },
      };
    },
  },
];

function generateActivities(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `活动 ${index + 1}`,
    description: `这是第 ${index + 1} 个活动的描述`,
    category: ['技术', '设计', '产品', '运营'][index % 4],
    startTime: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString(),
    location: ['北京', '上海', '深圳', '杭州'][index % 4],
    price: index % 3 === 0 ? 'free' : Math.floor(Math.random() * 500) + 50,
    status: 'published',
    coverImage: `https://picsum.photos/400/300?random=${index}`,
    // ... 其他字段
  }));
}
```

#### 用户认证 Mock
```typescript
// mock/auth.ts
export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { email, password } = body;
      
      // 模拟登录验证
      if (email === 'admin@example.com' && password === 'password') {
        return {
          code: 0,
          message: '登录成功',
          data: {
            accessToken: 'mock_access_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
            expiresIn: 3600,
            user: {
              id: 1,
              username: 'admin',
              email: 'admin@example.com',
              profile: {
                nickname: '管理员',
                avatar: 'https://picsum.photos/100/100?random=1',
              },
            },
          },
        };
      }
      
      return {
        code: 20005,
        message: '用户名或密码错误',
        data: null,
      };
    },
  },
];
```

### Mock 数据生成工具

```typescript
// mock/utils.ts
import { Random } from 'mockjs';

export function generateUser(id: number) {
  return {
    id,
    username: `user${id}`,
    email: Random.email(),
    phone: Random.phone(),
    profile: {
      nickname: Random.cname(),
      avatar: `https://picsum.photos/100/100?random=${id}`,
      gender: Random.pick(['male', 'female', 'other']),
      birthday: Random.date('yyyy-MM-dd'),
      bio: Random.cparagraph(1, 3),
      location: Random.city(),
    },
    status: 'active',
    emailVerified: Random.boolean(),
    phoneVerified: Random.boolean(),
    createdAt: Random.datetime('yyyy-MM-ddTHH:mm:ssZ'),
  };
}

export function generateActivity(id: number) {
  const startTime = Random.datetime('yyyy-MM-ddTHH:mm:ssZ');
  const endTime = new Date(new Date(startTime).getTime() + 3 * 60 * 60 * 1000);
  
  return {
    id,
    name: Random.ctitle(5, 15),
    description: Random.cparagraph(2, 4),
    category: Random.pick(['技术', '设计', '产品', '运营', '市场']),
    tags: Array.from({ length: Random.integer(1, 4) }, () => Random.cword(2, 6)),
    startTime,
    endTime: endTime.toISOString(),
    location: `${Random.province()}${Random.city()}`,
    price: Random.boolean() ? Random.integer(50, 500) : 'free',
    maxParticipants: Random.integer(20, 200),
    currentParticipants: Random.integer(0, 50),
    status: Random.pick(['published', 'ongoing', 'ended']),
    coverImage: `https://picsum.photos/400/300?random=${id}`,
    organizer: {
      id: Random.integer(1, 10),
      name: Random.cname(),
      avatar: `https://picsum.photos/50/50?random=${Random.integer(1, 100)}`,
    },
    rating: Random.float(3, 5, 1, 1),
    reviewCount: Random.integer(0, 100),
    createdAt: Random.datetime('yyyy-MM-ddTHH:mm:ssZ'),
  };
}

export function generateOrder(id: string) {
  return {
    id,
    orderNumber: `ORD${Random.datetime('yyyyMMddHHmmss')}`,
    activity: generateActivity(Random.integer(1, 100)),
    user: generateUser(Random.integer(1, 100)),
    participants: [
      {
        name: Random.cname(),
        phone: Random.phone(),
        email: Random.email(),
      },
    ],
    pricing: {
      unitPrice: Random.integer(50, 500),
      quantity: 1,
      subtotal: Random.integer(50, 500),
      discount: Random.integer(0, 50),
      tax: 0,
      total: Random.integer(50, 450),
      currency: 'CNY',
    },
    status: Random.pick(['pending', 'paid', 'confirmed', 'cancelled']),
    paymentStatus: Random.pick(['unpaid', 'paid', 'refunded']),
    createdAt: Random.datetime('yyyy-MM-ddTHH:mm:ssZ'),
    expiredAt: Random.datetime('yyyy-MM-ddTHH:mm:ssZ'),
  };
}
```

---

本 API 文档提供了完整的接口规范和使用示例，开发者可以根据此文档进行前端开发和后端接口对接。Mock 数据服务确保了前端开发的独立性和效率。
