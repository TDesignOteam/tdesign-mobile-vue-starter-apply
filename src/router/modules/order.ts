import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/order',
    name: 'order',
    component: Layout,
    children: [
      {
        path: 'confirm',
        name: 'orderConfirm',
        component: () => import('@/pages/order/confirm/index.vue'),
        meta: {
          title: { zh_CN: '购买确认', en_US: 'BuyConfirm' },
        },
      },
    ],
  },
];
