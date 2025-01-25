<template>
  <footer class="navigation bg-white text-primary">
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ active: isActive('/') || isChildActive('/cocktails') }" 
        @click="navigateTo('/')"
      >
        <i class="fa-solid fa-martini-glass-citrus"></i>
        <span>Cocktails</span>
      </div>

      <div 
        class="tab" 
        :class="{ active: isActive('/favorites') }" 
        @click="navigateTo('/favorites')"
      >
        <i class="fa-solid fa-heart"></i>
        <span>Favoris</span>
      </div>

      <div 
        class="tab" 
        :class="{ active: isActive('/chat') || isChildActive('/chat') }" 
        @click="navigateTo('/chat')"
      >
        <i class="fa-solid fa-comments"></i>
        <span>Chat</span>
      </div>

      <div 
        class="tab" 
        :class="{ active: isActive('/account') }" 
        @click="navigateTo('/account')"
      >
        <i class="fa-solid fa-user"></i>
        <span>Compte</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()
const route = useRoute()

// Fonction de navigation
function navigateTo(routePath) {
  if (route.path !== routePath) {
    router.push(routePath)
  }
}

// Vérifie si la route est strictement active
function isActive(path) {
  return route.path === path
}

// Vérifie si une route enfant est active (pour les routes dynamiques comme "/cocktails/:id" ou "/chat/:id")
function isChildActive(basePath) {
  return route.path.startsWith(basePath)
}


</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 3.75rem;
  border-top: 1px solid #ccc;
  background-color: var(--background-color);
  position: fixed;
  bottom: 0;
  width: 100%;
}

.tabs {
  display: flex;
  width: 100%;
  justify-content: space-around;
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: var(--text-color);
}

.tab.active {
  color: var(--primary-color);
  font-weight: bold;
}

.tab i {
  font-size: 1.25rem;
}

.tab span {
  font-size: 0.75rem;
  text-transform: none;
}
</style>
