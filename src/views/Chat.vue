<template>
  <div v-if="isAuthenticated">
    <div v-if="locationReady">
      <h1>Salons de discussions à proximité</h1>
      <Loading v-if="isLoading" />

      <div v-if="bars.length > 0" class="bar-list">
        <div v-for="bar in bars" :key="bar._id" class="bar">
          <Bar :id="bar._id" :name="bar.name" :image="bar.image_url" />
        </div>
      </div>

      <div class="no-bar" v-else-if="!isLoading || fetchError">
        <i class="fa-solid fa-location-dot fa-10x"></i>
        <h2>Aucun salon de discussion trouvé à proximité, réessayez à un autre endroit.</h2>
        <Button text="Retour à la page d'accueil" icon="fa-solid fa-martini-glass-citrus" @click="navigateTo('/')" />
      </div>
    </div>

    <EnableLocation v-else activeIcon="fa-solid fa-location-arrow" />
  </div>

  <ConnectionLanding activeIcon="fa-solid fa-comments" v-else />
</template>

<script setup>
import { ref, watch } from 'vue';
import Bar from '../components/Bar.vue';
import ConnectionLanding from '../components/ConnectionLanding.vue';
import EnableLocation from '../components/EnableLocation.vue';
import { isAuthenticated } from '../store/user';
import { useFetchApiCrud } from '../composables/useFetchApiCrud';
import useLocationStore from '../store/locationStore';
import Button from '../components/Button.vue';
import Loading from '../components/Loading.vue';
import { useRouter } from 'vue-router';

const { coords, locationError, locationReady } = useLocationStore();

const router = useRouter();
const barCrud = useFetchApiCrud('bars', import.meta.env.VITE_API_URL);
const isLoading = ref(true);
const bars = ref([]);
const fetchError = ref(false);
const lastCoords = ref({ latitude: null, longitude: null });

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const fetchBars = async () => {
  try {
    const { latitude, longitude } = coords.value;

    if (!latitude || !longitude) {
      return;
    }

    isLoading.value = true;
    const data = await barCrud.fetchApi({
      url: `bars?lat=${latitude}&lng=${longitude}`,
      method: 'GET',
    });
    bars.value = data;
  } catch (e) {
    fetchError.value = true;
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => coords.value,
  async (newCoords) => {
    const { latitude, longitude } = newCoords;

    if (
      isAuthenticated.value &&
      latitude !== null &&
      longitude !== null &&
      (!lastCoords.value.latitude ||
        calculateDistance(
          lastCoords.value.latitude,
          lastCoords.value.longitude,
          latitude,
          longitude
        ) > 50)
    ) {
      lastCoords.value = { latitude, longitude };
      isLoading.value = true;
      await fetchBars();
    }
  },
  { immediate: true }
);

function navigateTo(route) {
  router.push(route);
}
</script>


<style scoped>
.no-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: var(--text-color-light);
  color: var(--primary-color);
  text-align: center;
}

.bar {
  cursor: pointer;

}

h2 {
  color: var(--text-color);
}
</style>