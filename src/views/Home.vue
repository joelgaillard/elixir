<template>
      <createButton />
  <div class="q-pa-md">
    <div class="text-h3 text-weight page-title q-pa-sm">Cocktails</div>

    <div class="row q-col-gutter-md">
      <div v-for="cocktail in cocktails" 
           :key="cocktail._id" 
           class="col-12 col-xs-6 col-sm-4 col-md-3">
        <CocktailCard 
        :id="cocktail._id"
          :name="cocktail.name"
          :image="cocktail.image_url"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import CocktailCard from '../components/CocktailCard.vue'
import { useFetchApiCrud } from '../composables/useFetchApiCrud';
import createButton from '../components/createButton.vue'

const cocktailCrud = useFetchApiCrud('cocktails', import.meta.env.VITE_API_URL);
const {data: cocktails} = cocktailCrud.readAll();

</script>

<style scoped>
.page-title {
  font-family: var(--heading-font-family);
}
/* Style pour maintenir les proportions des cartes */
.row {
  display: flex;
  flex-wrap: wrap;
}

/* Mobile petit (< 400px) : 1 carte */
@media (max-width: 399px) {
  .col-12 {
    width: 100%;
  }
}

/* Mobile grand/Tablette portrait (400px - 767px) : 2 cartes */
@media (min-width: 400px) and (max-width: 767px) {
  .col-xs-6 {
    width: 50%;
  }
}

/* Tablette/Petit desktop (768px - 1023px) : 3 cartes */
@media (min-width: 768px) and (max-width: 1023px) {
  .col-sm-4 {
    width: 33.333%;
  }
}

/* Grand desktop (≥ 1024px) : 4 cartes */
@media (min-width: 1024px) {
  .col-md-3 {
    width: 25%;
  }
}
</style>