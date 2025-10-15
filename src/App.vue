<script setup lang="ts"></script>

<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive :include="['MainPage']">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>
