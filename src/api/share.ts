import axios from '@/utils/request'

export interface AppItem {
  id: string
  name: string
  icon: string
}

export interface Person {
  id: string
  name: string
  avatar?: string
  birthday?: string
  phone?: string
  idCard?: string
  email?: string
  profession?: string
  isDefault: boolean
}

/**
 * 获取朋友列表
 * @returns 朋友列
 */
export function getFriendList(): Promise<Person[]> {
  return axios.get('/share/friends')
}

/**
 * 获取社交媒体应用列表
 * @returns 应用列表
 */
export function getAppList(): Promise<AppItem[]> {
  return axios.get('/share/app')
}
