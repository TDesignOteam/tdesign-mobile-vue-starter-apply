<template>
  <div class="result-page container-view">
    <div class="result-status">
      <check-circle-icon class="success-icon" size="70" color="#2BAA71" />
      <span class="status-title"> 购买成功 </span>
    </div>

    <div v-if="activity" class="activity-card">
      <t-image :src="activity.fullImg || activity.img" fit="cover" class="activity-img" />
      <div class="activity-info">
        <span class="activity-title"> {{ activity.name }} </span>
        <div class="activity-details">
          <div>
            <time-icon size="16" color="#0052D9" />
            <span class="activity-details-text">{{ dayjs(activity?.date?.[0]).format('YYYY年MM月DD日') }}</span>
          </div>
          <div>
            <location-icon size="16" color="#0052D9" />
            <span class="activity-details-text">{{ activity.place || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="users.length &gt; 0" class="applicant-wrapper">
      <div class="applicant-title">
        <span>报名人员</span>
      </div>
      <div class="applicant-list">
        <div class="user-cell-list">
          <t-cell
            v-for="user in users"
            :key="user.id"
            shape="circle"
            :title="user.name"
            :description="`${getAge(user.birthday)}岁 ${Occupation.find((i) => i.value === user.occupation)?.label || ''}`"
          >
            <template #leftIcon>
              <t-avatar shape="circle" :image="user.avatar" />
            </template>
          </t-cell>
        </div>
      </div>
    </div>

    <div class="action-btns">
      <t-button
        class="btn"
        theme="light"
        variant="outline"
        block
        size="medium"
        :icon="shareIcon"
        @click="handleShareClick"
      >
        分享给朋友
      </t-button>
      <t-button class="btn" theme="primary" size="medium" block @click="goToActivityDetail">去查看</t-button>
    </div>
  </div>

  <t-popup v-model:visible="shareActionSheetVisible" class="share-action-sheet" placement="bottom" destroy-on-close>
    <div class="share-popup-content">
      <div v-for="(item, listIndex) in shareActionSheet" :key="item.label" class="share-section">
        <div class="section-title">{{ item.label }}</div>
        <div class="section-list">
          <div v-for="(icon, index) in item.children" :key="index" class="section-item">
            <img :src="icon.img" class="section-img" :class="`section-img--${listIndex}`" />
            <p class="section-name">{{ icon.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <t-button class="rectangle-button" size="large" variant="text" block @click="shareActionSheetVisible = false">
      取消
    </t-button>
  </t-popup>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { CheckCircleIcon, LocationIcon, ShareIcon, TimeIcon } from 'tdesign-icons-vue-next';
import { computed, h, ref } from 'vue';
import { useRouter } from 'vue-router';

import type { ActivityModel } from '@/api/model/listModel';
import { Occupation } from '@/config/consts';
import { shareActionSheet } from '@/constants';
import { useResultStore } from '@/store/modules/result';
import type { UserInfo } from '@/types/interface';
import { getAge } from '@/utils/activity/getDate';

const shareIcon = () => h(ShareIcon, { size: '20px' });

const resultStore = useResultStore();
const router = useRouter();

const activity = computed<ActivityModel | null>(() => resultStore.getActivity);

const users = computed<UserInfo[]>(() => resultStore.getUsers);

const goToActivityDetail = () => {
  if (activity.value) {
    router.push(`/activity/${activity.value.id}`);
  }
};

const shareActionSheetVisible = ref(false);

const handleShareClick = () => {
  shareActionSheetVisible.value = true;
};
</script>
<style lang="less" scoped>
@import './index.less';
</style>
