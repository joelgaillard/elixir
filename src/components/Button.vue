<template>
  <button @click="handleClick">
    <i v-if="icon" :class="icon"></i>
    {{ text }}
  </button>
</template>


<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false,
    default: ''
  }
})

const emits = defineEmits(['click'])

function handleClick(event) {
  emits('click', event)
}
</script>

<style scoped>
button {
  padding: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 1.875rem;
  background-color: var(--primary-color);
  color: var(--background-color);
  font-family: var(--sen-bold);
  border: none;
  font-size: 1rem;
  font-weight: var(--bold);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

button:hover {
  background-color: var(--accent-color);
  cursor: pointer;
}
</style>