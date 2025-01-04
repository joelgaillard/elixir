<template>
  <div v-if="isAuthenticated">
    <h1>Favoris</h1>
    <div class="cocktail-grid">
      <div v-for="cocktail in cocktails" :key="cocktail._id" class="cocktail-card">
        <CocktailCard @remove-favorite="removeFavorite" :id="cocktail._id" :name="cocktail.name"
          :image="cocktail.image_url" :rank="cocktail.rank" :ratings-count="cocktail.ratingsCount" />
      </div>
    </div>
  </div>
  <ConnectionLanding activeIcon="fa-solid fa-heart" v-else />
</template>

<script setup>
import CocktailCard from '../components/CocktailCard.vue'
import ConnectionLanding from '../components/ConnectionLanding.vue'
import { useFetchApiCrud } from '../composables/useFetchApiCrud';
import { isAuthenticated } from '../store/user';


const favoritesCrud = useFetchApiCrud('users/me/favorites', import.meta.env.VITE_API_URL);
const { data: cocktails } = favoritesCrud.readAll();

function removeFavorite(id) {
  cocktails.value = cocktails.value.filter(cocktail => cocktail._id !== id);
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
</style>