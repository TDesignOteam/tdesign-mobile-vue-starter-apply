import { isFinite } from 'lodash';
import { defineStore } from 'pinia';

import { store } from '@/store';
import type { UserInfo } from '@/types/interface';

interface UsersInfo {
  list: UserInfo[];
  default: number;
}

const defaultUsers = [
  {
    id: 1,
    name: '蔡宣轩',
    birthday: '2001-01-01',
    avatar: '/assets/image/avatar.png',
    phone: '12345678910',
    identityCard: 'ABCD',
    email: 'mail@example.com',
    occupation: 'art-practitioners',
  },
];

export const useUsersStore = defineStore('users', {
  state: () => ({
    userInfo: {
      list: [...defaultUsers],
      default: null,
    } as UsersInfo,
  }),
  getters: {
    defaultUser: (state) =>
      state.userInfo.default && state.userInfo.list.find((item) => item.id === state.userInfo.default)?.id,
    users: (state) => state.userInfo.list,
  },
  actions: {
    addUser(info: UserInfo, setToDefault = false) {
      const id = this.getCurrentMaxUserId() + 1;
      this.userInfo.list.push({ ...info, id });
      if (setToDefault) {
        this.userInfo.default = id;
      }
    },

    getCurrentMaxUserId() {
      const ids = this.userInfo.list.map((item) => item.id);
      const maxId = Math.max(...ids);
      return isFinite(maxId) ? maxId : 0;
    },
  },
});

export function getUsersStore() {
  return useUsersStore(store);
}
