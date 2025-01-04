<template>
  <footer class="navigation bg-white text-primary">
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ active: tab === 'cocktails' }" 
        @click="navigateTo('/')"
      >
        <i class="fa-solid fa-martini-glass-citrus"></i>
        <span>Cocktails</span>
      </div>
      
      <div 
        class="tab" 
        :class="{ active: tab === 'favorites' }" 
        @click="navigateTo('/favorites')"
      >
        <i class="fa-solid fa-heart"></i>
        <span>Favoris</span>
      </div>
      
      <div 
        class="tab" 
        :class="{ active: tab === 'chat' }" 
        @click="navigateTo('/chat')"
      >
        <i class="fa-solid fa-comments"></i>
        <span>Chat</span>
      </div>
      
      <div 
        class="tab" 
        :class="{ active: tab === 'account' }" 
        @click="navigateTo('/account')"
      >
        <i class="fa-solid fa-user"></i>
        <span>Compte</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute();
const tab = ref('cocktails')

function navigateTo(route) {
  tab.value = route === '/' ? 'cocktails' : route.substring(1)
  router.push(route)
}

const isActive = (path) => {
  return route.path === path;
};

</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
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
  padding: 10px;
  cursor: pointer;
  color: var(--text-color);
}

.tab.active {
  color: var(--primary-color);
}

.tab i {
  font-size: 20px;
}

.tab span {
  font-size: 12px;
  text-transform: none;
}
</style>