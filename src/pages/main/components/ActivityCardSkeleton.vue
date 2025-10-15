<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 4,
  },
})
</script>

<template>
  <div v-for="i in count" :key="`skeleton-${i}`" class="card">
    <t-skeleton
      animation="flashed"
      :loading="true"
      :row-col="[{ size: '120px' }]"
    />
    <div class="card__content">
      <slot>
        <t-skeleton
          animation="flashed"
          :loading="true"
          style="margin-bottom: 8px"
          :row-col="[{ height: '22px', width: '80%' }]"
        />
        <t-skeleton
          animation="flashed"
          :loading="true"
          :row-col="[{ height: '20px', width: '95%' }]"
        />
        <t-skeleton
          animation="flashed"
          :loading="true"
          :row-col="[{ height: '22px', width: '60%' }]"
          style="margin-top: auto;"
        />
      </slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.card {
  margin: 16px;
  display: flex;
  height: var(--card-height);
  border-radius: var(--td-radius-large);
  box-shadow: var(--td-shadow-3);
  overflow: hidden;
  &__content {
    .p-16();
    .flex-col();
    width: 100%;
    padding-bottom: 12px;
  }
}
</style>
