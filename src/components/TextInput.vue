<template>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="text-input"
    />
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  
  // Définition des props avec validation
  const props = defineProps({
    modelValue: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    }
  })
  
  const emits = defineEmits(['update:modelValue'])
  </script>
  
  <style scoped>
  
  .text-input {
    width: 100%;
    padding: 0.75rem;
    padding-left: 1rem;
    border: 1px solid #ccc;
    border-radius: 1.875rem;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;
    box-sizing: border-box;
  }
  
  .text-input:focus {
    border-color: var(--primary-color)
  }

  .has-error input {
  border-color: var(--error);
}
  </style>