<template>
  <form-render :form-options="formOptions" :btn-config="btns" @confirm="onConfirm" />
</template>
<script setup lang="ts">
import { Toast } from 'tdesign-mobile-vue';

import FormRender from '@/components/form';
import type { BtnConfig } from '@/components/form/type';
import { formOptions } from '@/config/userinfo';
import router from '@/router';
import { useUsersStore } from '@/store/modules/users';
import type { UserInfo } from '@/types/interface';

const userStoreRefs = useUsersStore();

interface FormData extends UserInfo {
  setDefault: boolean;
}

const btns: BtnConfig[] = [
  {
    theme: 'primary',
    size: 'large',
    type: 'submit',
    block: true,
    t: 'components.form.submitBtn',
  },
];

const onConfirm = (result: object | boolean, data: FormData) => {
  if (result === true) {
    const { setDefault, occupation } = data;
    userStoreRefs.addUser(
      {
        ...data,
        occupation: occupation?.[0],
      },
      setDefault,
    );
    Toast({
      theme: 'success',
      direction: 'column',
      message: '添加成功',
    });
    setTimeout(() => {
      router.back();
    }, 1500);
  }
};
</script>
<style lang="less" scoped>
@import './index.less';
</style>
