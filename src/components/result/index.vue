<template>
  <div class="result-container">
    <div class="result-bg-img">
      <component :is="dynamicComponent"></component>
    </div>
    <div class="result-title">{{ title }}</div>
    <div class="result-tip">{{ tip }}</div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import Result403Icon from '@/assets/assets-result-403.svg?component';
import Result404Icon from '@/assets/assets-result-404.svg?component';
import Result500Icon from '@/assets/assets-result-500.svg?component';

const { type } = defineProps({
  bgUrl: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  tip: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
});

const dynamicComponent = computed(() => {
  switch (type) {
    case '403':
      return Result403Icon;
    case '404':
      return Result404Icon;
    case '500':
      return Result500Icon;
    default:
      return Result403Icon;
  }
});
</script>
<style lang="less" scoped>
.result {
  &-link {
    color: var(--td-brand-color);
    text-decoration: none;
    cursor: pointer;

    &:hover {
      color: var(--td-brand-color);
    }

    &:active {
      color: var(--td-brand-color);
    }

    &--active {
      color: var(--td-brand-color);
    }

    &:focus {
      text-decoration: none;
    }
  }

  &-container {
    min-height: 400px;
    height: 75vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &-bg-img {
    width: 200px;
    color: var(--td-brand-color);
  }

  &-title {
    margin: 8px 0 4px;
    color: var(--td-text-color-primary);
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    font-style: normal;
  }

  &-tip {
    font-size: 14px;
    line-height: 22px;
    color: var(--td-text-color-secondary);
  }
}
</style>
