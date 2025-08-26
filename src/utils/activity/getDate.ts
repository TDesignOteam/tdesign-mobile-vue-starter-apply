import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { isArray } from 'lodash';

import type { ActivityModel } from '@/api/model/listModel';

dayjs.extend(isBetween);

// 查找某个项目的最前（最早）的日期
export const getEarlyDate = (item: ActivityModel) => {
  const { date } = item;
  if (!date) return 0;
  // 比较每一个日期
  return date.reduce((pre, cur) => {
    return dayjs(pre).isBefore(dayjs(cur)) ? pre : cur;
  });
};

// 查找某个项目的最后（最晚）的日期
export const getLatestDate = (item: ActivityModel) => {
  const { date } = item;
  if (!date) return 0;
  // 比较每一个日期
  return date.reduce((pre, cur) => {
    return dayjs(cur).isBefore(dayjs(pre)) ? pre : cur;
  });
};

// 查找某个项目的最后（最晚）的日期
export const getLatestDate_YMD = (i: string[]) => {
  return i.reduce((pre, cur) => {
    return dayjs(cur).isBefore(dayjs(pre)) ? pre : cur;
  });
};

// 查找某个项目的最前（最早）的日期
export const getEarlyDate_YMD = (i: string[]) => {
  return dayjs(
    i.reduce((pre, cur) => {
      return dayjs(pre).isBefore(dayjs(cur)) ? pre : cur;
    }),
  ).format('YYYY年MM月DD日');
};

export const getDateRangeYMD = (item: ActivityModel) => {
  const early = getEarlyDate(item);
  const latest = getLatestDate(item);
  if (early === latest) return dayjs(early).format('YYYY年MM月DD日');
  return getDateRangeString([dayjs(early).toDate(), dayjs(latest).toDate()], '至');
};

export const getDateYMD = (i: string[]) => {
  const early = getEarlyDate_YMD(i);
  const latest = getLatestDate_YMD(i);
  if (early === latest) return dayjs(early).format('YYYY年MM月DD日');
  return getDateRangeString([dayjs(early).toDate(), dayjs(latest).toDate()], ' ');
};

export const getDateRangeString = (date: Date[], split: string = '-') => {
  // 单个时间转换
  function convertSingleTime(timeStr: Date): string {
    const date = dayjs(timeStr, 'YYYY-MM-DD');
    const YY = date.format('YYYY');
    const MM = date.format('M');
    const DD = date.format('DD');

    return `${YY}年${MM}月${DD}日`;
  }

  if (isArray(date)) {
    const startDate = dayjs(date?.[0], 'YYYY-MM-DD');
    const endDate = dayjs(date?.[1], 'YYYY-MM-DD');

    const daysDiff = endDate.diff(startDate, 'day');

    const firstFormatted = convertSingleTime(date[0]);
    let secondFormatted: string;

    if (daysDiff < 365 && startDate.isSame(endDate, 'year')) {
      // 相差一年以下
      secondFormatted = endDate.format('M月DD日');
    } else {
      // 相差一年以上
      secondFormatted = convertSingleTime(date?.[1]);
    }
    return `${firstFormatted} ${split} ${secondFormatted}`;
  } else {
    console.error('Invalid input type');
  }

  return '';
};

export const getAge = (date: string) => {
  const now = dayjs();
  const diff = now.diff(dayjs(date), 'year');
  return diff === 0 ? '-' : diff;
};

export const dateIncludes = (item: ActivityModel, date: Date[]) => {
  const { date: itemDate } = item;
  // date是一个日期范围 itemDate是具体的日期group
  return itemDate.some((dateItem) => {
    const [start, end] = date;
    return dayjs(dateItem).isBetween(start, end, null, '[]');
  });
};
