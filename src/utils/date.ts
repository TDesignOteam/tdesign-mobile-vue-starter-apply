import type { ManipulateType } from 'dayjs'
import dayjs from 'dayjs'

/**
 * 生成日期范围：从过去N个月到未来N个月，默认过去6个月到未来6个月
 * @param pastCount 过去的数量，默认6
 * @param futureCount 未来的数量，默认6
 * @param pastUnit 过去的单位，例如 'month', 'week', 'day'，默认为 'month'
 * @param futureUnit 未来的单位，例如 'month', 'week', 'day'，默认为 'month'
 * @returns [startDate, endDate] 格式的日期数组
 */
export function generateDateRange(pastCount = 6, futureCount = 6, pastUnit: ManipulateType = 'month', futureUnit: ManipulateType = 'month'): [Date, Date] {
  const startDate = dayjs().subtract(pastCount, pastUnit).toDate()
  const endDate = dayjs().add(futureCount, futureUnit).toDate()
  return [startDate, endDate]
}

/**
 * 判断日期是否早于今日
 * @param date 日期
 * @returns 是否过期
 */
export function isExpired(date: string | number | Date): boolean {
  if (!date)
    return false

  const endOfDay = dayjs(date).endOf('day')
  if (!endOfDay.isValid())
    return false

  return dayjs().isAfter(endOfDay)
}

/**
 * 格式化单个日期为中文格式
 * @param date 日期对象（支持多种格式）
 * @param options 格式化选项
 * @param options.showYear 是否显示年份，默认为 true
 * @param options.showMonth 是否显示月份，默认为 true
 * @param options.showDay 是否显示日期，默认为 true
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: string | number | Date,
  options: {
    showYear?: boolean
    showMonth?: boolean
    showDay?: boolean
  } = {},
): string {
  if (!date)
    return ''

  const dateObj = dayjs(date)
  if (!dateObj.isValid())
    return ''

  const {
    showYear = true,
    showMonth = true,
    showDay = true,
  } = options

  const year = dateObj.year()
  const month = dateObj.month() + 1
  const day = dateObj.date()

  const parts: string[] = []
  if (showYear)
    parts.push(`${year}年`)
  if (showMonth)
    parts.push(`${month}月`)
  if (showDay)
    parts.push(`${day}日`)

  return parts.join('')
}

/**
 * 格式化日期范围为中文格式
 * @param dateRange 日期范围数组
 * @returns 格式化后的日期范围字符串
 */
export function formatDateRange(dateRange: Date[]): string {
  if (dateRange.length === 0)
    return ''
  if (dateRange.length === 1) {
    return formatDate(dateRange[0])
  }

  const [startDate, endDate] = dateRange
  const startYear = startDate.getFullYear()
  const startMonth = startDate.getMonth() + 1
  const startDay = startDate.getDate()
  const endYear = endDate.getFullYear()
  const endMonth = endDate.getMonth() + 1
  const endDay = endDate.getDate()

  if (startYear === endYear) {
    return `${startYear}年${startMonth}月${startDay}日-${endMonth}月${endDay}日`
  }
  return `${startYear}年${startMonth}月${startDay}日-${endYear}年${endMonth}月${endDay}日`
}

/**
 * 日期比较函数，用于排序
 * @param dateA 日期A
 * @param dateB 日期B
 * @param order 排序顺序：'asc' | 'desc'
 * @returns 比较结果
 */
export function compareDates(
  dateA: string | number | Date,
  dateB: string | number | Date,
  order: 'asc' | 'desc' = 'desc',
): number {
  const timeA = dayjs(dateA).valueOf()
  const timeB = dayjs(dateB).valueOf()

  if (order === 'asc') {
    return timeA - timeB
  }
  return timeB - timeA
}

/**
 * 检查日期是否在指定范围内
 * @param date 待检查的日期
 * @param startDate 起始日期
 * @param endDate 结束日期
 * @returns 是否在范围内
 */
export function isDateInRange(
  date: string | number | Date,
  startDate: string | number | Date,
  endDate: string | number | Date,
): boolean {
  const targetTime = dayjs(date).valueOf()
  const startTime = dayjs(startDate).valueOf()
  const endTime = dayjs(endDate).valueOf()

  return targetTime >= startTime && targetTime <= endTime
}
