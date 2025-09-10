<template>
  <div class="result-page container-view">
    <div class="result-page__status">
      <check-circle-icon class="result-page__status-icon" size="70" color="#2BAA71" />
      <span class="result-page__status-title"> 购买成功 </span>
    </div>

    <div v-if="activity" class="result-page__activity-card">
      <t-image :src="activity.fullImg || activity.img" fit="cover" class="result-page__activity-card-image" />
      <div class="result-page__activity-card-info">
        <span class="result-page__activity-card-title"> {{ activity.name }} </span>
        <div class="result-page__activity-card-details">
          <div>
            <time-icon size="16" color="#0052D9" />
            <span class="result-page__activity-card-details-text">
              {{ dayjs(activity?.date?.[0]).format('YYYY年MM月DD日') }}
            </span>
          </div>
          <div>
            <location-icon size="16" color="#0052D9" />
            <span class="result-page__activity-card-details-text">{{ activity.place || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="users.length &gt; 0" class="result-page__applicant-section">
      <div class="result-page__applicant-title">
        <span>报名人员</span>
      </div>
      <div class="result-page__applicant-list">
        <div>
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

    <div class="result-page__actions">
      <t-button
        class="result-page__action-button"
        theme="light"
        variant="outline"
        block
        size="medium"
        :icon="shareIcon"
        @click="handleShareClick"
      >
        分享给朋友
      </t-button>
      <t-button class="result-page__action-button" theme="primary" size="medium" block @click="goToActivityDetail">
        去查看
      </t-button>
    </div>
  </div>

  <t-popup v-model:visible="shareActionSheetVisible" class="share-sheet" placement="bottom" destroy-on-close>
    <div style="border-bottom: 0.5px solid var(--td-border-level-1-color); padding-bottom: 8px">
      <div v-for="(item, listIndex) in shareActionSheet" :key="item.label" class="share-sheet__content">
        <div class="share-sheet__content-title">{{ item.label }}</div>
        <div class="share-sheet__content-list">
          <div v-for="(icon, index) in item.children" :key="index" class="share-sheet__item">
            <img
              :src="icon.img"
              class="share-sheet__item-image"
              :class="{ 'share-sheet__item-image--rounded': listIndex === 0 }"
            />
            <p class="share-sheet__item-name">{{ icon.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <t-button
      class="share-sheet__cancel-button"
      size="large"
      variant="text"
      block
      @click="shareActionSheetVisible = false"
    >
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
