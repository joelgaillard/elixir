<template>
    <form @submit.prevent="handleLogin">
        <div class="login-element title">
        <h1>Connexion</h1>
        </div>
        <div class="login-element" :class="{ 'has-error': hasError('email') }">
            <label for="email">E-mail</label>
            <TextInput v-model="email" type="email" placeholder="john.doe@example.com" />
            <div v-if="getError('email')" class="error-message">{{ getError('email') }}</div>
        </div>
        <div class="login-element" :class="{ 'has-error': hasError('password') }">
            <label for="password">Mot de passe</label>
            <TextInput v-model="password" type="password" placeholder="PasswordSecure123!" />
            <div v-if="getError('password')" class="error-message">{{ getError('password') }}</div>
        </div>
        <div class="login-element buttons">
            <Button text="Se connecter"/>
            <div>Vous n’avez pas de compte? <router-link to="/register">S’inscrire</router-link></div>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import TextInput from './TextInput.vue'
import Button from './Button.vue'
import { useRouter } from 'vue-router'
import { useFetchApiCrud } from '../composables/useFetchApiCrud'
import { setDefaultHeaders } from '../composables/useFetchApi'
import {user, token, isAuthenticated} from '../store/user'

const router = useRouter()
const email = ref('')
const password = ref('')
const errors = ref([])
const authApi = useFetchApiCrud('users/login', import.meta.env.VITE_API_URL)


function hasError(field) {
  return errors.value.some(error => error.field === field)
}

function getError(field) {
  const error = errors.value.find(error => error.field === field)
  return error ? error.msg : null
}

async function handleLogin() {
    try {
        const response = await authApi.fetchApi({
            url: 'users/login',
            data: {
                email: email.value,
                password: password.value
            },
            method: 'POST'
        })

        if (response?.token) {
            // 1. Définir le token dans les headers
            setDefaultHeaders({ Authorization: `Bearer ${response.token}` })
            
            // 2. Attendre que les headers soient mis à jour
            await new Promise(resolve => setTimeout(resolve, 100))
            
            // 3. Récupérer les données utilisateur avec le nouveau token
            const userData = await authApi.fetchApi({
                url: 'users/me',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${response.token}`
                }
            })
            
            // 4. Mettre à jour le store
            user.value = userData
            isAuthenticated.value = true
            token.value = response.token

            console.log(user.value)
            console.log(token.value)
            
            // 5. Rediriger
            router.back()
        }
    } catch (e) {
        errors.value = e.data?.errors || []
        console.error('Erreur:', e)
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

.login-element {
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