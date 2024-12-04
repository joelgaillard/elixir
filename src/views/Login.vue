<template>
  <div>
    <h1>Login</h1>
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
import { useFetchApiCrud } from '../composables/useFetchApiCrud'

const email = ref('')
const password = ref('')
const router = useRouter()
const authApi = useFetchApiCrud('users/login', import.meta.env.VITE_API_URL)

async function handleLogin() {
  const response = await authApi.create({
    email: email.value,
    password: password.value
  })
  
  if (response.token) {
    console.log('Token:', response.token)
    localStorage.setItem('token', response.token)
    router.push({ name: 'Home' })
  }
}
</script>