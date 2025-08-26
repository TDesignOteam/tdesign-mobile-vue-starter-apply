<template>
  <div class="mine-page container-view">
    <div class="mine-page__card">
      <t-avatar class="mine-page__card-avatar" size="large" :image="userInfo.avatar" alt=""></t-avatar>
      <div class="mine-page__card-content">
        <div class="mine-page__card-info">
          <div class="mine-page__card-name">{{ userInfo.username }}</div>
          <div class="mine-page__card-tags">
            <div v-show="userInfo.age !== 0" class="mine-page__card-tag">{{ userInfo.age }}岁</div>
            <div v-show="userInfo.occupation !== ''" class="mine-page__card-tag" style="margin-left: 8px">
              {{ Occupation.find((item) => item.value === userInfo.occupation)?.label }}
            </div>
          </div>
        </div>
        <div class="mine-page__card-edit" @click="onEdit"><edit-icon size="20px" /></div>
      </div>
    </div>
    <div class="mine-page__activity">
      <t-tabs :value="currentValue" :list="tabList" class="mine-page__activity-tabs" @change="onChange">
        <t-tab-panel
          v-for="item in tabList"
          :key="item.value"
          :value="item.value"
          :badge-props="item.badgeProps"
          class="mine-page__activity-panel"
        >
          <t-list :async-loading="activityLoading ? 'loading' : ''" class="mine-page__activity-list" @scroll="onScroll">
            <div
              v-for="cell in filterActivityList(allActivityList.list, currentValue)"
              :key="cell.id"
              class="mine-page__activity-item"
              align="middle"
            >
              <div class="mine-page__activity-item-img">
                <img :src="cell.img" alt="" />
              </div>
              <div class="mine-page__activity-item-content">
                <div class="mine-page__activity-item-info">
                  <div class="mine-page__activity-item-name">{{ cell.name }}</div>
                  <div class="mine-page__activity-item-date">
                    {{ getEarlyDate_YMD(isArray(cell.date) ? cell.date : [cell.date]) }}
                  </div>
                </div>
                <div class="mine-page__activity-item-footer">
                  <div
                    class="mine-page__activity-item-status"
                    :style="{ color: cell.status ? '' : 'var(--td-success-color)' }"
                  >
                    {{ cell.status ? '已完成' : '待参加' }}
                  </div>
                  <div v-if="cell.status" class="mine-page__activity-item-comment" @click="onComment">去评价</div>
                </div>
              </div>
            </div>
            <template #footer>
              <div v-if="userInfo.userid === -1" class="mine-page__login-prompt" @click.stop="onLogin">
                您还未登录，点击登录
              </div>
              <div
                v-if="userInfo.userid !== -1 && isShowLoading && !isShowAll"
                class="mine-page__load-more"
                @click.stop="() => onActivityLoad(false, true)"
              >
                <empty class="mine-page__load-more-icon" />
                <div class="mine-page__load-more-text">加载更多</div>
              </div>
              <div v-if="userInfo.userid !== -1 && isShowAll" class="mine-page__list-end">
                <div>
                  <span class="mine-page__list-end-text">我是有底线哒</span>
                </div>
              </div>
            </template>
          </t-list>
        </t-tab-panel>
      </t-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isArray } from 'lodash';
import { EditIcon } from 'tdesign-icons-vue-next';
import type { TabValue } from 'tdesign-mobile-vue';
import { Toast } from 'tdesign-mobile-vue';
import type { Ref } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';

import { getMyActivityList, getUserInfo } from '@/api/list';
import type { MyActivityList, MyActivityListResult, UserInfoResult } from '@/api/model/listModel';
import Empty from '@/components/result/Empty';
import { Occupation } from '@/config/consts';
import { getEarlyDate_YMD } from '@/utils/activity/getDate';

// 用户信息
const userInfo = ref<UserInfoResult>({ userid: -1, username: '', age: 0, avatar: '', occupation: '' });
// 分页加载活动列表
const currentPage = ref<number>(1);
// 待参加的右上角的小红点
const badge = ref<boolean>(false);
// 是否显示“点击加载更多”
const isShowLoading = ref<boolean>(true);
// 是否显示“再往下滑也没有啦”
const isShowAll = ref<boolean>(false);
// 活动列表存储
const allActivityList = ref<MyActivityListResult>({ list: [], is_end: false });
// t-list的加载loading
const activityLoading = ref(false);
// 活动列表的tab值
const currentValue = ref<TabValue>('0');

const tabList = computed(() => [
  {
    value: '0',
    label: '待参加',
    badgeProps: { dot: badge.value, offset: [-4, 1] },
  },
  {
    value: '1',
    label: '已完成',
  },
  {
    value: '2',
    label: '全部活动',
  },
]);

// 点击蓝字登录时触发
const onLogin = () => {
  console.log('登录 逻辑需要自行开发～');
};

// 点击编辑icon触发
const onEdit = () => {
  if (userInfo.value.userid === -1) {
    return;
  }
  console.log('编辑 逻辑需要自行开发～');
};

const onComment = () => {
  console.log('评论 逻辑需要自行开发～');
};

// 活动列表滚动到底部触发
const onScroll = (scrollBottom: number) => {
  if (scrollBottom < 50) {
    onActivityLoad();
  }
};

// 更改活动列表tab时触发
const onChange = (value: TabValue) => {
  currentValue.value = value;
  isShowLoading.value = calShowLoading();
};

// 根据t-list盒子的高和视窗高进行判断，看是否需要显示“点击加载更多”
const calShowLoading: () => boolean = () => {
  const viewportWidth = window.innerWidth;
  const vwHeight = viewportWidth * 1.1;
  const totalHeight = filterActivityList(allActivityList.value.list, currentValue.value).length * 152;
  // 列表盒子的子项内容未overflow时就显示“点击加载更多”
  return totalHeight < vwHeight;
};

// 加工活动列表，以在切换到不同tab时，能够正确显示对应的内容
const filterActivityList: (arr: MyActivityList[], tabVal: TabValue) => MyActivityList[] = (
  arr: MyActivityList[],
  tabVal: TabValue,
) => {
  // 和tab文字的意义对应，筛选即可
  switch (tabVal) {
    case '2':
      return arr;
    case '1':
      return arr.filter((item) => item?.status === 1);
    case '0':
      return arr.filter((item) => item?.status === 0);
  }
};

// 异步请求活动列表
const loadActivityData = async (data: Ref<MyActivityListResult>, isRefresh?: boolean, loadMore = false) => {
  try {
    const page = isRefresh ? 1 : currentPage.value + 1 + (loadMore ? 1 : 0); // 分页加载活动列表，一次不必存储全部
    const userid = userInfo.value.userid !== -1 && userInfo.value.userid;

    // 未登录就不请求
    if (userInfo.value.userid === -1) {
      Toast({
        theme: 'error',
        direction: 'column',
        message: '您还未登录，请先登录',
      });
      return;
    }

    const temp = await getMyActivityList({ page, userid });

    // 检查是否需要增加“待参加”的右上角小红点
    watch(
      () => temp.list.some((item) => item.status === 0),
      (bool) => {
        return bool ? (badge.value = true) : (badge.value = false);
      },
      { immediate: true },
    );

    if (temp.list) {
      if (isRefresh) {
        data.value = temp;
        currentPage.value = 1;
      } else {
        currentPage.value++;
        data.value.list.push(...temp.list);
        data.value.is_end = temp.is_end;
        isShowAll.value = temp.is_end;
      }
    }
    isShowLoading.value = calShowLoading(); // 检查活动数量是否多到overflow了
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

// 加载活动列表主函数
const onActivityLoad = (isRefresh?: boolean, loadMore = false) => {
  // 已经加载完或仍在加载时，不请求
  if (allActivityList.value.is_end || activityLoading.value) {
    return;
  }
  activityLoading.value = true;
  loadActivityData(allActivityList, isRefresh, loadMore)
    .catch((err) => {
      console.log(err);

      Toast({
        theme: 'error',
        direction: 'column',
        message: err,
      });
    })
    .finally(() => {
      activityLoading.value = false;
    });
};

// 加载用户信息
const onUserInfoLoad = async () => {
  const res = await getUserInfo();
  userInfo.value = res;
  onActivityLoad();
};

onMounted(() => {
  onUserInfoLoad();
});
</script>
<style scoped lang="less">
@import './index.less';
</style>
