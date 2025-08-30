import { isEmpty, isFinite } from 'lodash';
import { defineStore } from 'pinia';

import { store } from '@/store';
import type { UserInfo } from '@/types/interface';

interface UsersInfo {
  list: UserInfo[];
  default: number;
}

interface LoginStrange {
  [x: string]: any;
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
    loginStrange: {} as LoginStrange,
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

    checkLogin() {
      return !isEmpty(this.loginStrange);
    },

    async login(userInfo: Record<string, any>) {
      const mockLogin = async (userInfo: Record<string, any>) => {
        // 登录请求流程
        console.log(`用户信息:`, userInfo);
        // const { account, password } = userInfo;
        // if (account !== 'w') {
        //   return {
        //     code: 401,
        //     message: '账号不存在',
        //   };
        // }
        // if (['dev_'].indexOf(password) === -1) {
        //   return {
        //     code: 401,
        //     message: '密码错误',
        //   };
        // }
        return {
          code: 200,
          message: '登录成功',
        };
      };

      const res = await mockLogin(userInfo);
      if (res.code !== 200) {
        throw res;
      }
      this.loginStrange = {
        id: this.getCurrentMaxUserId() + 1,
        ...userInfo,
      };
    },
    async logout() {
      this.loginStrange = {};
    },
  },
});

export function getUsersStore() {
  return useUsersStore(store);
}
