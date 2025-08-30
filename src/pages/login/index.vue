<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="title-container">
        <h1 class="title">登录</h1>
        <div class="sub-title">
          <p class="tip">{{ type === 'register' ? t('pages.login.existAccount') : t('pages.login.noAccount') }}</p>
          <p class="tip" @click="switchType(type === 'register' ? 'login' : 'register')">
            {{ type === 'register' ? t('pages.login.signIn') : t('pages.login.createAccount') }}
          </p>
        </div>
      </div>

      <login v-if="type === 'login'" />
      <register v-else @register-success="switchType('login')" />
    </div>

    <footer class="copyright">Copyright @ 2025 Tencent. All Rights Reserved</footer>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import { t } from '@/locales';

import Login from './components/Login.vue';
import Register from './components/Register.vue';

defineOptions({
  name: 'LoginIndex',
});
const type = ref('login');
const switchType = (val: string) => {
  type.value = val;
};
</script>
<style lang="less" scoped>
@import './index.less';
</style>
