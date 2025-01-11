<template>
    <form @submit.prevent="handleRegister">
        <div class="register-element title">
        <h1>Inscription</h1>
        </div>
        <div class="register-element" :class="{ 'has-error': hasError('username') }">
            <label for="username">Nom d'utilisateur</label>
            <TextInput v-model="username" type="text" placeholder="JoDo_123" />
            <div v-if="getError('username')" class="error-message">{{ getError('username') }}</div>
        </div>
        <div class="register-element" :class="{ 'has-error': hasError('email') }">
            <label for="email">E-mail</label>
            <TextInput v-model="email" type="email" placeholder="john.doe@example.com" />
            <div v-if="getError('email')" class="error-message">{{ getError('email') }}</div>
        </div>
        <div class="register-element" :class="{ 'has-error': hasError('password') }">
            <label for="password">Mot de passe</label>
            <TextInput v-model="password" type="password" placeholder="PasswordSecure123!" />
            <div v-if="getError('password')" class="error-message">{{ getError('password') }}</div>
        </div>
        <div class="register-element" :class="{ 'has-error': hasError('confirmPassword') }">
    <label for="confirmPassword">Confirmation du mot de passe</label>
    <TextInput v-model="confirmPassword" type="password" placeholder="PasswordSecure123!" />
    <div v-if="getError('confirmPassword')" class="error-message">{{ getError('confirmPassword') }}</div>
  </div>
        <div class="register-element buttons">
            <Button text="S'inscrire et se connecter" />
            <div>Vous avez déjà un compte? <router-link to="/login">Connexion</router-link></div>
        </div>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import TextInput from './TextInput.vue'
import Button from './Button.vue'
import { useRouter } from 'vue-router'
import { useFetchApiCrud } from '../composables/useFetchApiCrud'
import { setDefaultHeaders } from '../composables/useFetchApi'
import { isAuthenticated } from '../store/user'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref([])
const router = useRouter()

const usersApi = useFetchApiCrud('users', import.meta.env.VITE_API_URL)

function hasError(field) {
  return errors.value.some(error => error.field === field)
}

function getError(field) {
  const error = errors.value.find(error => error.field === field)
  return error ? error.msg : null
}

async function handleRegister() {
    errors.value = []
  if (password.value !== confirmPassword.value) {
    errors.value = [{ field: 'confirmPassword', msg: 'Les mots de passe ne correspondent pas' }]
    return
  } 
    const response = await usersApi.fetchApi({
        url: 'users',
        data: {
            username: username.value,
            email: email.value,
            password: password.value
        },
        method: 'POST'
    }).catch(e => {
        errors.value = e.data.errors
        console.error(e.data)
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

<style scoped>
form {
    display: flex;
    flex-direction: column;
    align-items: right;
    padding-left: 5%;
    padding-right: 5%;
}

.register-element {
    margin-bottom: 1.5rem;
}

label {
    margin-left: 1rem;
}

.error-message {
    color: var(--error);
    margin-left: 1rem;
}

.buttons {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    gap: 2rem;
    justify-content: center;
}




</style>