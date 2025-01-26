import { ref, computed, watch } from "vue";
import { useGeolocation } from "@vueuse/core";

const useLocationStore = () => {
  const coords = ref({ latitude: null, longitude: null });
  const locationError = ref(null);

  const { coords: geoCoords, error } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    default: { latitude: null, longitude: null },
  });

  watch(geoCoords, (newCoords) => {
    if (newCoords) {
      coords.value = {
        latitude: newCoords.latitude,
        longitude: newCoords.longitude,
      };
    }
  });

  watch(error, (newError) => {
    locationError.value = newError;
  });

  const locationReady = computed(
    () => coords.value.latitude !== null && coords.value.longitude !== null
  );

  return {
    coords,
    locationError,
    locationReady,
  };
};

export default useLocationStore;
