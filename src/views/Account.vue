<template>
  <div v-if="isAuthenticated">
    <p> Bienvenue sur votre compte !</p>
    <Button class="button" text="Se déconnecter" @click="handleLogout" />
  </div>
  <ConnectionLanding activeIcon="fa-solid fa-user" v-else />

</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ConnectionLanding from '../components/ConnectionLanding.vue'
import Button from '../components/Button.vue'
import { setDefaultHeaders } from '../composables/useFetchApi'
import { isAuthenticated } from '../store/user'
import { user } from '../store/user'

const router = useRouter()

function handleLogout() {
  isAuthenticated.value = false
  user.value = null
  setDefaultHeaders({ Authorization: "" })
  console.log(user.value)
  router.push('/')
}

</script>

<style scoped>
.account {
  padding: 20px;
}

.button {
  background-color: var(--error);

}

.button:hover {
  background-color: var(--error-dark);
  color: var(--background-color);
}

</style>