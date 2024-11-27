<template>
  <q-footer bordered class="bg-white text-primary">
    <q-tabs
      v-model="tab"
      class="text-grey-6"
      active-color="red"
      indicator-color="var(--accent-color)"
      align="justify"
    >
      <q-tab 
        name="cocktails" 
        icon="fa-solid fa-martini-glass-citrus" 
        label="Cocktails"
        @click="navigateTo('/')"
      />
      
      <q-tab 
        name="favorites" 
        icon="fa-solid fa-heart" 
        label="Favoris"
        @click="navigateTo('/favorites')"
      />
      
      <q-tab 
        name="messages" 
        icon="fa-solid fa-comments" 
        label="Messages"
        @click="navigateTo('/chat')"
      />
      
      <q-tab 
        name="account" 
        icon="fa-solid fa-user" 
        label="Compte"
        @click="navigateTo('/account')"
      />
    </q-tabs>
  </q-footer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tab = ref('cocktails')

function navigateTo(route) {
  router.push(route)
}
</script>

<style scoped>

q-tab {
  text-transform: none;
}

.q-footer {
  height: 60px;
}

/* Utiliser les variables CSS globales avec des sélecteurs plus spécifiques */
.q-footer .q-tabs {
  background-color: var(--background-color) !important;
}

.q-footer .q-tab__label {
  text-transform: none !important;
  color: var(--text-color) !important;
}



</style>