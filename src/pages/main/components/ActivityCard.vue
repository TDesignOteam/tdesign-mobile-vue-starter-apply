<script setup lang="ts">
const props = defineProps({
  cover: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="card">
    <div class="card__cover">
      <t-image :src="props.cover" :alt="props.title" fit="cover" />
    </div>
    <div class="card__content">
      <h3>{{ props.title }}</h3>
      <div class="slot-content">
        <slot name="content" />
      </div>
      <div class="slot-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.card {
  display: flex;
  margin: var(--td-spacer-2);
  height: var(--card-height);
  border-radius: var(--td-radius-large);
  box-shadow: var(--td-shadow-3);
  overflow: hidden;
  &__cover {
    flex-shrink: 0;
    width: var(--card-height);
    height: 100%;

    .t-image {
      height: var(--card-height);
      width: 100%;
    }
  }

  &__content {
    .p-16();
    .flex-col();
    flex: 1;
    width: 100%;
    min-width: 0;
    padding-bottom: 12px;
    h3 {
      .font();
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .slot-content {
    display: flex;
  }

  .slot-footer {
    .font(14px, 600);
    margin-top: auto;
  }
}
</style>
