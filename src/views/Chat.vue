<template>
  <div v-if="isAuthenticated">
    <div v-if="locationReady">
      <h1>Salons de discussions à proximité</h1>
      <div v-if="bars.length > 0">
        <div v-for="bar in bars" :key="bar._id" class="bar">
          <Bar :id="bar._id" :name="bar.name" :image="bar.image_url" />
        </div>
      </div>
      <div class="no-bar" v-else-if="!isLoading || fetchError">
        <i class="fa-solid fa-location-dot fa-10x"></i>
        <h2>Aucun salon de discussion trouvé à proximité, réessayez à un autre endroit.</h2>
        <Button text="Retour à la page d'accueil" icon="fa-solid fa-martini-glass-citrus" @click="navigateTo('/')"/>
      </div>
    </div>
    <EnableLocation v-else-if="!isLoading" activeIcon="fa-solid fa-location-arrow" />
  </div>
  <ConnectionLanding activeIcon="fa-solid fa-comments" v-else />
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import Bar from '../components/Bar.vue';
import ConnectionLanding from '../components/ConnectionLanding.vue';
import EnableLocation from '../components/EnableLocation.vue';
import { isAuthenticated } from '../store/user';
import { useFetchApiCrud } from '../composables/useFetchApiCrud';
import useLocationStore from '../store/locationStore';
import Button from '../components/Button.vue';
import { useRouter } from 'vue-router'

const { coords, locationError, locationReady } = useLocationStore()

// Initialisation
const router = useRouter();
const barCrud = useFetchApiCrud('bars', import.meta.env.VITE_API_URL);
const isLoading = ref(true);
const bars = ref([]);
const fetchError = ref(false);

// Fonction de récupération des bars
const fetchBars = async () => {
  console.log('Début fetchBars');
  try {
    const { latitude, longitude } = coords.value;
    if (!latitude || !longitude) {
      console.log('Coordonnées manquantes:', coords.value);
      return;
    }
    
    isLoading.value = true;
    const data = await barCrud.fetchApi({
      url: `bars?lat=${latitude}&lng=${longitude}`,
      method: 'GET',
    });
    bars.value = data;
    console.log('Bars récupérés:', data);
  } catch (e) {
    console.error('Erreur fetchBars:', e);
    fetchError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Observer les changements de coordonnées
watchEffect(async () => {
  const { latitude, longitude } = coords.value;
  console.log('Watch coords:', coords.value);
  if (isAuthenticated.value && latitude!==null && longitude!==null) {
    isLoading.value = true;
    await fetchBars();
  } else {
    isLoading.value = false;
  }
});

function navigateTo(route) {
    router.push(route)
  }

</script>

<style scoped>
.no-bar{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;
  background-color: var(--text-color-light);
  color: var(--primary-color);
  text-align: center;
}

.bar {
  cursor: pointer;

}

h2{
  color: var(--text-color);
}

</style>