<template>
  <div v-if="isAuthenticated">
    <h1>Favoris</h1>

    <!-- Si aucun favori -->
    <div class="no-favorites" v-if="cocktails.length === 0 && !loading">
      <i class="fa-solid fa-martini-glass-citrus fa-10x"></i>
      <h2>Vous n'avez aucun cocktail mis en favoris</h2>
      <Button text="Retour à la page d'accueil" icon="fa-solid fa-martini-glass-citrus" @click="navigateTo('/')"/>
    </div>

    <!-- Indicateur de chargement -->

    <Loading v-if="loading" />
    <!-- Grille des favoris -->
    <div v-else class="cocktail-grid">

      <div v-for="cocktail in cocktails" :key="cocktail._id" class="cocktail-card">
        <CocktailCard
          @remove-favorite="removeFavorite"
          :id="cocktail._id"
          :name="cocktail.name"
          :image="cocktail.image_url"
          :rank="cocktail.rank"
          :ratings-count="cocktail.ratingsCount"
        />
      </div>
    </div>
  </div>
  <ConnectionLanding activeIcon="fa-solid fa-heart" v-else />
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import CocktailCard from '../components/CocktailCard.vue'
import ConnectionLanding from '../components/ConnectionLanding.vue'
import { useFetchApiCrud } from '../composables/useFetchApiCrud'
import { isAuthenticated } from '../store/user'
import Button from '../components/Button.vue'
import { useRouter } from 'vue-router'
import Loading from '../components/Loading.vue'

const router = useRouter()
const favoritesCrud = useFetchApiCrud('users/me/favorites', import.meta.env.VITE_API_URL)

// Récupération des données via `readAll`
const { data: rawCocktails } = favoritesCrud.readAll() // Données brutes
const cocktails = ref([]) // Données transformées
const loading = ref(true) // État de chargement

// Surveiller les changements dans les données brutes
watchEffect(() => {
  if (rawCocktails.value && Array.isArray(rawCocktails.value)) {
    cocktails.value = rawCocktails.value // Assigner directement les données
    loading.value = false // Terminer le chargement
  }
})

// Supprimer un favori
function removeFavorite(id) {
  try {
    cocktails.value = cocktails.value.filter(cocktail => cocktail._id !== id) // Supprime localement
    favoritesCrud.del(id) // Appelle l'API pour supprimer
  } catch (error) {
  }
}

function navigateTo(path) {
  router.push(path)
}
</script>

<style scoped>
.cocktail-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

/* Mobile grand/Tablette portrait (400px - 767px) : 2 colonnes */
@media (min-width: 400px) and (max-width: 767px) {
  .cocktail-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablette/Petit desktop (768px - 1023px) : 3 colonnes */
@media (min-width: 768px) and (max-width: 1023px) {
  .cocktail-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop (1024px - 1439px) : 4 colonnes */
@media (min-width: 1024px) and (max-width: 1439px) {
  .cocktail-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Grand desktop (≥ 1440px) : 6 colonnes */
@media (min-width: 1440px) {
  .cocktail-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.no-favorites {
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

h2 {
  padding-top: 1rem;
}
</style>
