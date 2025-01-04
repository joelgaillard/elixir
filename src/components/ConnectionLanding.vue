<template>
    <div class="container">
      <h1>Vous devez être connecté pour accéder à cette section</h1>
      <i :class="`${activeIcon} fa-10x`"></i>
      <Button text="Se connecter" icon="fa fa-user" @click="navigateTo('/login')" />
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  import Button from './Button.vue'
  import { useRouter } from 'vue-router'
  
  const props = defineProps({
    activeIcon: {
      type: String,
      required: true
    }
  })
  
  const router = useRouter()
  
  function navigateTo(route) {
    router.push(route)
  }
  </script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 5rem;
    padding-left: 5%;
    padding-right: 5%;
}

i {
    color: var(--text-color-light);
} 


</style>