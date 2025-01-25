<template>
  <div class="search-container">
    <input 
      type="text"
      v-model="searchQuery"
      placeholder="Rechercher..."
      class="search-input"
    />
    <i class="fa-solid fa-magnifying-glass search-icon"></i>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useFetchApiCrud } from '../composables/useFetchApiCrud'

const searchQuery = ref('')
const emit = defineEmits(['search-results'])
const cocktailsApi = useFetchApiCrud('cocktails', import.meta.env.VITE_API_URL)

let timeout = null

watch(searchQuery, (newValue) => {
  clearTimeout(timeout)
  timeout = setTimeout(async () => {
    if (newValue) {
      try {
        const response = await cocktailsApi.fetchApi({
          url: `cocktails?name=${newValue}`,
          method: 'GET'
        })
        // Émet les résultats et la requête actuelle
        emit('search-results', { cocktails: response.cocktails, pagination: response.pagination }, newValue)
      } catch (error) {
      }
    } else {
      emit('reset-search') // Réinitialise la recherche
    }
  }, 300)
})
</script>

<style scoped>

.search-container {
  display: flex;
  align-items: center;
  position: relative;
}

  .has-error input {
  border-color: var(--error);
}

.search-input {
  width: 100%;
    padding: 0.75rem;
    padding-left: 2.5rem;
    border: 1px solid #ccc;
    border-radius: 1.875rem;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;
}

.search-input:focus {
    border-color: var(--primary-color)
  }

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
</style>