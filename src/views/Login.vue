<template>
  <div>
    <h1>Login</h1>
    <div v-if="error">erreur</div>
    <form @submit.prevent="handleLogin"> <!-- Changé ici de "login" à "handleLogin" -->
      <input v-model="email" type="text" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFetchApiCrud} from '../composables/useFetchApiCrud'
import {setDefaultHeaders} from '../composables/useFetchApi'
import { isAuthenticated } from '../store/user'

const email = ref('')
const password = ref('')
const error = ref(false)
const router = useRouter()
const authApi = useFetchApiCrud('users/login', import.meta.env.VITE_API_URL)

async function handleLogin() {
  const response = await authApi.fetchApi({
    url:'users/login',
    data: {
      email: email.value,
      password: password.value
    },
    method: 'POST'
  }).catch(e => {
    error.value = true
  })

  if (response?.token) {
    console.log('Data:', response)
    console.log('Token:', response.token)
    setDefaultHeaders({ Authorization: `Bearer ${response.token}` })
    isAuthenticated.value = true
    router.push({ name: 'Home' })
  }
}
</script>