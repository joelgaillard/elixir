<template>
  <div>
    <h1>Mon Compte</h1>
    <p v-if="isAuthenticated">Bienvenue sur votre compte !</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = false // À remplacer par votre logique d'authentification

onMounted(() => {
  if (!isAuthenticated) {
    router.push('/login')
  }
})
</script>

<style scoped>
.account {
  padding: 20px;
}
</style>