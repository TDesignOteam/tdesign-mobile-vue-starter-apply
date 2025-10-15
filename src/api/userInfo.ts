import axios from '@/utils/request'

export interface UserProfile {
  id: string
  name: string
  age: number
  occupation: string
  avatar: string
  city: string
}

export function getUserProfile(): Promise<UserProfile> {
  return axios.get<UserProfile, UserProfile>('/user/profile')
}
