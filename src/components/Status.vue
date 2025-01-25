<template>
  <div :class="['status', type]">
    <i class="icon" :class="icon"></i>
    <div>{{ message }}</div>
  </div>
</template>

<script setup>

import { computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success'
  }
})

const icon = computed(() => {
  return props.type === 'success'
    ? 'fa-solid fa-check-circle'
    : 'fa-solid fa-exclamation-circle';
});
</script>

<style scoped>
.status {
  padding: 1rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: var(--background-color);
}

.success {
  color: var(--success);
  border: var(--success) 1px solid;
}

.icon {
  font-size: 1.5rem;
}

.error {
  color: var(--error);
  border-color: #e6c3c3;
  border: var(--error) 1px solid;
}
</style>