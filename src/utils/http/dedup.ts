let toastDedupIntervalMs = 800
let lastToastMessage = ''
let lastToastTimestamp = 0

/**
 * 设置错误提示的去重/节流时间窗口。
 *
 * @param ms - 毫秒数，必须大于等于 0。传入非法值将被忽略。
 */
export function setToastDedupInterval(ms: number) {
  // 配置节流时间窗口；传入负数或非法值将被忽略
  if (Number.isFinite(ms) && ms >= 0)
    toastDedupIntervalMs = ms
}

/**
 * 判断某条错误提示是否需要跳过展示（基于内容去重与时间节流）。
 *
 *
 * @param message - 提示文案
 * @returns 若应跳过展示返回 true；否则返回 false
 */
export function shouldSkipMessage(message: string): boolean {
  // 当 message 与上次一致，且在时间窗口内，返回 true（跳过提示）
  const now = Date.now()
  if (message && message === lastToastMessage && now - lastToastTimestamp < toastDedupIntervalMs) {
    return true
  }
  // 记录最近一次提示内容与时间戳
  lastToastMessage = message
  lastToastTimestamp = now
  return false
}
