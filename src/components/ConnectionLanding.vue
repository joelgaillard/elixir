<template>
  <div class="container">
    <h1>Vous devez être connecté pour accéder à cette section</h1>
    <i :class="`${activeIcon} fa-10x`"></i>
    <Button text="Se connecter" icon="fa fa-user" @click="navigateTo('/login')" />
  </div>
</template>

<script setup>
import Button from './Button.vue'
import { useRoute, useRouter } from 'vue-router'


const props = defineProps({
  activeIcon: {
    type: String,
    required: true
  }
})

const route = useRoute()
const router = useRouter()

function navigateTo(routePath) {
  if (routePath === '/login' || routePath === '/register') {
    router.push({
      path: routePath,
      query: { redirect: route.fullPath },
    })
  } else {
    router.push(routePath)
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3rem;
  padding-left: 5%;
  padding-right: 5%;
}

i {
  color: var(--text-color-light);
}
</style>