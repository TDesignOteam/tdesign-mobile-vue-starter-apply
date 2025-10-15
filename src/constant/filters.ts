import { generateDateRange } from '@/utils/date'

const [oneWeekAgo, sixMonthsLater] = generateDateRange(1, 6, 'week', 'month')

export const defaultFilterOptions = {
  domain: [
    'IT互联网',
    '艺术设计',
    '科技',
    '电商',
    '教育',
    '医疗健康',
    '心理学',
    '摄影',
  ],
  type: ['讲座', '展览', '工作坊'],
  minPrice: 0,
  maxPrice: 588,
  dateRange: [oneWeekAgo, sixMonthsLater],
}
