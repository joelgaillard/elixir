<template>
  <div id="app">

    <div v-if="isLoading || isError" class="app-loading-container">
      <Loading label="Connexion au serveur…" />
      <p v-if="isError" class="error-server">Impossible de se connecter au serveur. Veuillez réessayer plus tard.</p>
    </div>

    <div v-else>
      <header></header>
      <main>
        <router-view />
      </main>
      <footer>
        <Navigation />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Navigation from "./components/Navigation.vue";
import Loading from "./components/Loading.vue";

const isLoading = ref(true); 
const isError = ref(false); 
let retryInterval = null; 
let timeoutHandle = null;

const maxRetryDuration = 10 * 60 * 1000;
const retryIntervalDuration = 5000; 

// Fonction pour vérifier l'état du backend en utilisant une requête HEAD sur la route "/ingredients" (route la plus légère du backend)
async function checkBackend() {
  const url = `${import.meta.env.VITE_API_URL}ingredients`;

  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      throw new Error(`Ping échoué : statut ${response.status}`);
    }
    
    isLoading.value = false;
    isError.value = false; 
    clearInterval(retryInterval);
    clearTimeout(timeoutHandle);
  } catch (error) {
  }
}

onMounted(() => {
  checkBackend();

  retryInterval = setInterval(async () => {
    await checkBackend();
  }, retryIntervalDuration);

  timeoutHandle = setTimeout(() => {
    isLoading.value = false; 
    isError.value = true;
    clearInterval(retryInterval);
  }, maxRetryDuration);
});

onUnmounted(() => {
  clearInterval(retryInterval);
  clearTimeout(timeoutHandle);
});
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
}

.app-loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--background-color);
  font-family: Arial, sans-serif;
}

.app-loading-container p {
  margin-top: 1rem;
  font-size: 1.2rem;
}

.error-server {
  color: var(--error);
  margin-top: 1rem;
  font-size: 1rem;
  text-align: center;
}

main {
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 0;
  padding-bottom: 4rem;
}
</style>
