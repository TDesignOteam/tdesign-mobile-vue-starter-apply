<template>
  <div class="order-confirm-container container-view">
    <!-- 活动信息 -->
    <div class="event-info">
      <div class="event-info__title">{{ activityList.name }}</div>
      <div class="event-info__details">
        <div class="event-info__details-item">
          <time-icon size="16px" />
          <span>{{ getDateRangeYMD(activityList) }}</span>
        </div>
        <div class="event-info__details-item">
          <location-icon size="16px" />
          <span>{{ activityList.place || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- 人员信息 -->
    <div class="section-container">
      <div class="section-container__header">
        <div class="section-container__header-title">{{ t('pages.order.detail.personList') }}</div>
        <t-button size="extra-small" shape="round" @click="onAddPerson">
          <add-icon size="16px" />
          <span>{{ t('pages.order.detail.addPerson') }}</span>
        </t-button>
      </div>
      <div>
        <t-checkbox-group v-model:value="formData.personList" class="horizontal-box" borderless>
          <div
            v-for="person in users"
            :key="person.id"
            class="card"
            :class="{ 'card--active': formData.personList.includes(person.id) }"
          >
            <check-icon v-if="formData.personList.includes(person.id)" class="card__icon"></check-icon>
            <t-checkbox :value="person.id" :label="person.name" :icon="false" />
          </div>
        </t-checkbox-group>
      </div>
    </div>

    <!-- 票类场次 -->
    <div class="section-container">
      <div class="section-container__header">
        <div class="section-container__header-title">{{ t('pages.order.detail.ticketTypes') }}</div>
      </div>
      <div>
        <t-checkbox-group v-model:value="formData.date" borderless>
          <div
            v-for="date in activityList.date"
            :key="date"
            class="card"
            :class="{ 'card--active': formData.date.includes(date) }"
          >
            <check-icon v-if="formData.date.includes(date)" class="card__icon"></check-icon>
            <t-checkbox :value="date" :label="dayjs(date).format('YYYY年MM月DD日')" :icon="false" />
          </div>
        </t-checkbox-group>
      </div>
    </div>

    <!-- 票档价格 -->
    <div class="section-container">
      <div class="section-container__header">
        <div class="section-container__header-title">{{ t('pages.order.detail.ticketPrice') }}</div>
      </div>
      <div class="section-container__list">
        <t-checkbox-group v-model:value="formData.price" borderless>
          <div
            v-for="(price, index) in activityList.price"
            :key="index"
            class="section-container__list-item card"
            :class="{ 'card--active': formData.price.includes((price as ActivityPrice).name || price) }"
          >
            <check-icon v-if="formData.price.includes((price as ActivityPrice).name || price)" class="card__icon" />
            <t-checkbox
              :value="(price as ActivityPrice).name || (price as string)"
              :label="(price as ActivityPrice).name"
              :icon="false"
            >
              <template #content>
                <div class="section-container__list-item--price">
                  <span class="current-price">
                    {{ (price as ActivityPrice).discount || (price as ActivityPrice).price }}元
                  </span>
                  <span v-if="(price as ActivityPrice).discount" class="original-price">
                    {{ (price as ActivityPrice).price }}元
                  </span>
                </div>
              </template>
            </t-checkbox>
          </div>
        </t-checkbox-group>
      </div>
    </div>

    <!-- 底部按钮栏 -->
    <div class="order-confirm-container__actions">
      <div class="order-confirm-container__actions-info">
        <span>{{ t('pages.order.detail.pendingPay') }}:</span>
        <span class="total-price">¥{{ totalPrice }}</span>
      </div>
      <t-button class="btn" theme="primary" size="large" @click="onConfirm">{{
        t('pages.order.detail.confirmBuy')
      }}</t-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { AddIcon, CheckIcon, LocationIcon, TimeIcon } from 'tdesign-icons-vue-next';
import { Toast } from 'tdesign-mobile-vue';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { setMyActivity } from '@/api/list';
import type { ActivityPrice } from '@/api/model/listModel';
import { t } from '@/locales';
import { useUsersStore } from '@/store';
import { useResultStore } from '@/store/modules/result';
import { getDateRangeYMD } from '@/utils/activity/getDate';

const router = useRouter();
const activityStore = useResultStore();
const usersStore = useUsersStore();

const formData = reactive({
  personList: [],
  date: [],
  price: [],
});

const users = computed(() => {
  return usersStore.users;
});

const activityList = computed(() => {
  const actItem = activityStore.getActivity;
  // 处理价格是free的情况
  if (actItem.price === 'free') {
    actItem.price = [{ name: '免费参与', price: 0 }];
  }
  return actItem;
});

// 计算总价
const totalPrice = computed(() => {
  if (!activityList.value.price) return '';
  if (activityList.value.price === 'free') return 0;
  return (activityList.value.price as ActivityPrice[])
    .filter((p) => formData.price.includes(p.name || p))
    .map((p) => Number(p.discount || p.price))
    .reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0);
});

// 增加人员
const onAddPerson = () => {
  router.push('/mine/info');
};

const virPay = () => {
  Toast({
    theme: 'loading',
    direction: 'column',
    message: '支付中...',
  });
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(true);
    }, 2100);
  });
};

// 确认购买
const onConfirm = () => {
  // 简单校验
  if (formData.personList.length <= 0) {
    Toast({
      theme: 'warning',
      direction: 'column',
      message: '请选择人员',
    });
    return;
  }
  if (formData.date.length <= 0) {
    Toast({
      theme: 'warning',
      direction: 'column',
      message: '请选择场次',
    });
    return;
  }
  if (formData.price.length <= 0) {
    Toast({
      theme: 'warning',
      direction: 'column',
      message: '请选择价格',
    });
    return;
  }

  // 虚拟支付
  virPay()
    .then(() => {
      Toast({
        theme: 'success',
        direction: 'column',
        message: '支付成功！',
      });
      setTimeout(() => {
        activityStore.setActivity(activityList.value);
        const userlist = formData.personList.map((item) => {
          return users.value.find((user) => user.id === item);
        });
        activityStore.setUsers(userlist);
        activityStore.setOrder(formData);
        setMyActivity({
          ...activityList.value,
          status: 0,
        }).then(() => {
          router.replace('/result/success');
        });
      }, 2100);
    })
    .catch(() => {
      Toast({
        theme: 'error',
        direction: 'column',
        message: '支付失败！',
      });
    });
};
</script>
<style scoped lang="less">
@import './index.less';
</style>
