export function mapStatusToMessage(status?: number): string {
  switch (status) {
    case 401:
      return '未认证或登录已过期'
    case 404:
      return '资源未找到'
    default:
      return '请求失败'
  }
}
