<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  options: {
    type: Array as () => string[],
    required: true,
  },
  modelValue: {
    type: Array as () => string[],
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function handleChange(value: any) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div>
    <h4>{{ title }}</h4>
    <t-checkbox-group
      :value="modelValue"
      class="tag-container"
      borderless
      @change="handleChange"
    >
      <t-checkbox
        v-for="item in options"
        :key="item"
        :value="item"
        :icon="false"
        :style="{ padding: 0 }"
      >
        <div :class="`tag ${modelValue.includes(item) ? 'tag--active' : ''}`">
          {{ item }}
        </div>
      </t-checkbox>
    </t-checkbox-group>
  </div>
</template>

<style scoped lang="less">
h4 {
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
}

.tag-container {
  gap: 12px;
  display: grid;
  margin: 12px 0 24px 0;
  grid-template-columns: repeat(3, 1fr);

  .tag {
    height: 40px;
    font-size: 14px;
    line-height: 22px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--td-gray-color-1);
  }

  .tag--active {
    color: var(--td-brand-color-7);
    border: 1px solid var(--td-brand-color-7);
    background: var(--td-brand-color-1);
  }
}
</style>
