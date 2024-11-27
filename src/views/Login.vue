<template>
    <div class="row q-pa-md">
      <div class="col-12 col-md-5">
        <div class="column q-gutter-y-md items-center">
          <div class="full-width">
            <q-input
              v-model="username"
              label="Username"
              outlined
              :dense="dense"
            />
          </div>
          <div class="full-width">
            <q-input
              v-model="password"
              label="Password"
              type="password"
              outlined
              :dense="dense"
            />
          </div>
          <q-btn
            color="primary"
            icon="person"
            label="Login"
            class="full-width"
            @click="handleLogin"
          />
        </div>
      </div>
  
      <div class="col-12 col-md-2 flex items-center justify-center">
        <q-separator vertical class="hidden-mobile" />
        <q-separator horizontal class="mobile-only" >
          <div class="absolute-center bg-white q-px-sm">OR</div>
        </q-separator>
      </div>
  
      <div class="col-12 col-md-5 flex items-center justify-center">
        <q-btn
          color="positive"
          icon="person_add"
          label="Sign Up"
          class="full-width"
          @click="handleSignUp"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { QInput, QBtn, QSeparator } from 'quasar'
  
  const router = useRouter()
  const username = ref('')
  const password = ref('')
  const dense = ref(false)
  
  const handleLogin = async () => {
    console.log('Login attempt:', { username: username.value, password: password.value })
    router.push('/account')
  }
  
  const handleSignUp = () => {
    router.push('/signup')
  }
  </script>
  
  <style>
  .mobile-only {
    display: none;
  }
  @media (max-width: 768px) {
    .mobile-only {
      display: block;
    }
    .hidden-mobile {
      display: none;
    }
  }
  </style>