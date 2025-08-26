import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

const MyActivityList: any[] = [];

export default [
  {
    url: '/api/get-recommend-list',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({
          list: [
            {
              id: 1,
              img: '/assets/image/activity/sicc-2021.png',
            },
            {
              id: 2,
              img: '/assets/image/activity/sicc-2019.png',
            },
            {
              id: 3,
              img: '/assets/image/activity/sicc-2021.png',
            },
            {
              id: 4,
              img: '/assets/image/activity/sicc-2019.png',
            },
            {
              id: 5,
              img: '/assets/image/activity/sicc-2021.png',
            },
            {
              id: 6,
              img: '/assets/image/activity/sicc-2019.png',
            },
          ],
        }),
      },
    }),
  },
  {
    url: '/api/get-my-activity-list',
    method: 'get',
    params: {
      page: 1,
    },
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({
          list: [
            {
              id: 1,
              img: '/assets/image/activity/cover-2.png',
              name: '2021 SICC服务设计创新大会',
              date: '2021-3-16',
              status: 0,
            },
            {
              id: 2,
              img: '/assets/image/activity/cover-3.png',
              name: '少年与星空 插画巡展',
              date: '2021-6-5',
              status: 1,
            },
            {
              id: 3,
              img: '/assets/image/activity/cover-1.png',
              name: '2019 SICC服务设计创新大会',
              date: '2019-3-16',
              status: 1,
            },
            {
              id: 4,
              img: '/assets/image/activity/cover-4.png',
              name: 'Unverse AI艺术展',
              date: '2019-3-16',
              status: 1,
            },
            ...MyActivityList,
          ],
          is_end: true,
        }),
      },
    }),
  },
  {
    url: '/api/get-all-activity',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({
          list: [
            {
              id: 1,
              img: '/assets/image/activity/cover-1.png',
              name: '2019 SICC服务设计创新大会',
              date: ['2021-3-20', '2021-3-23', '2021-3-24'],
              price: 'free',
              evaluate: 5,
              field: 'art',
              type: 'lecture',
            },
            {
              id: 2,
              img: '/assets/image/activity/cover-2.png',
              fullImg: '/assets/image/activity/sicc-2021.png',
              name: '2021 SICC服务设计创新大会',
              field: 'art',
              type: 'lecture',
              price: [
                {
                  name: '早鸟价-单人票',
                  price: 128,
                  discount: 88,
                },
                {
                  name: '早鸟价-双人票',
                  price: 228,
                  discount: 168,
                },
                {
                  name: '正价-单人票',
                  price: 128,
                },
                {
                  name: '正价-双人票',
                  price: 228,
                },
              ],
              evaluate: 4.5,
              interested: 236,
              date: ['2021-3-16'],
              place: '深圳市腾讯滨海大厦',
              introduce:
                '在数字化时代背景下，如何抓住机遇，构建“数字”+“文化”更高效、宽领域、深覆盖的新时代文化创新之路，让优秀传统文化得以延续和新生，被更多人认可和接受，也是我们服务设计探索的方向。2021年5月16日，由腾讯用户研究与体验设计部（简称CDC）主办的第三届服务创新大会，将在深圳腾讯滨海大厦召开。近年来数字化正在赋能传统文化的传承和传播，而传统文化也同样在启发新的服务设计理念和思路，两者之间的界限越来越模糊，相互融合。本次大会将围绕文化保育和文化创新，邀请7位传统文物、建筑、服饰、工艺等不同艺术领域的行业专家，为我们分享最新发展趋势和实践经验，开拓来宾在传统文化与数字科技间的碰撞思路，探索新的服务设计课题，让我们先睹为快，了解这些专家们将会分享哪些主题。 ',
              guest: [
                {
                  name: '1',
                  img: '/assets/image/activity/guest-1.png',
                },
                {
                  name: '2',
                  img: '/assets/image/activity/guest-2.png',
                },
              ],
              venue: [
                {
                  name: '1',
                  img: '/assets/image/activity/venue-1.png',
                },
                {
                  name: '2',
                  img: '/assets/image/activity/venue-2.png',
                },
              ],
            },
            {
              id: 3,
              img: '/assets/image/activity/cover-3.png',
              name: '少年与星空 插画巡展',
              price: [
                {
                  name: '低档',
                  price: 98,
                },
                {
                  name: '高档',
                  price: 118,
                },
              ],
              date: ['2021-3-1', '2021-3-3'],
              evaluate: 4.5,
              field: 'art',
              type: 'exhibition',
            },
            {
              id: 4,
              img: '/assets/image/activity/cover-4.png',
              name: 'Unverse AI艺术展',
              price: [
                {
                  name: '低档',
                  price: 128,
                },
                {
                  name: '中档',
                  price: 198,
                },
                {
                  name: '高档',
                  price: 228,
                },
              ],
              date: ['2021-3-5'],
              evaluate: 3,
              field: ['it', 'art'],
              type: 'exhibition',
            },
          ],
        }),
      },
    }),
  },
  {
    url: '/api/get-activity-evaluate',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({
          'list|1-3': [
            {
              'id|+1': 1,
              'user|1': ['小小轩', '中中轩', '大大轩'],
              content: '我已经是第三次参加SICC大会了，作为一名服务体验设计行业的从业者，每次参与都受益匪浅...',
              avatar: '/assets/image/avatar.png',
            },
          ],
        }),
      },
    }),
  },
  {
    url: '/api/get-user-info',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({
          userid: 123456,
          avatar: '/assets/image/avatar.png',
          username: '蔡宣轩',
          age: 29,
          occupation: 'art-practitioners',
        }),
      },
    }),
  },
  {
    url: '/api/get-activity-interested',
    method: 'get',
    response: () => ({
      code: 0,
      data: [
        ...Mock.mock([
          {
            name: 'user1',
            avatar: '/assets/image/avatar.png',
          },
          {
            name: 'user2',
            avatar: '/assets/image/avatar2.png',
          },
          {
            name: 'user3',
            avatar: '/assets/image/avatar3.png',
          },
          {
            name: 'user4',
            avatar: '/assets/image/avatar4.png',
          },
          {
            name: 'user5',
            avatar: '/assets/image/avatar5.png',
          },
        ]),
      ],
    }),
  },
  {
    url: '/api/confirm-activity',
    method: 'post',
    response: ({ body }: { body: any }) => {
      MyActivityList.push(body);
      return {
        code: 0,
      };
    },
  },
] as MockMethod[];
