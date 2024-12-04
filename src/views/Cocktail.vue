<template>
  <div class="q-pa-md">
    <div class="text-h3 text-weight page-title q-pa-sm">{{ cocktail.name }}</div>

    <div class="cocktail-card">
      <img :src="cocktail.image_url" alt="Cocktail Image" class="cocktail-image" />
      <div class="cocktail-info">
        <p>
          {{ cocktail.description }}</p>
        <div class="instructions">
          <h4>Instructions</h4>
          <p>{{ cocktail.instructions }}</p>
        </div>
        <div class="ingredients">
          <h4>Ingredients</h4>
          <ul>
            <li v-for="ingredient in cocktail.ingredients" :key="ingredient">{{ ingredient }}</li>
          </ul>
        </div>
        <p><strong>Rank:</strong> {{ cocktail.rank }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useFetchApiCrud } from '../composables/useFetchApiCrud'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const cocktailCrud = useFetchApiCrud('cocktails', import.meta.env.VITE_API_URL)
const { data: cocktail } = cocktailCrud.read(props.id)
</script>

<style scoped>
.page-title {
  font-family: var(--heading-font-family);
  text-align: center;
  margin-bottom: 20px;
}

.cocktail-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cocktail-image {
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.cocktail-info {
  text-align: left;
  width: 100%;
}

.cocktail-info p {
  margin: 4px 0;
}

.instructions, .ingredients {
  margin-top: 16px;
}

.instructions h4, .ingredients h4 {
  margin-bottom: 8px;
}

.ingredients ul {
  list-style-type: disc;
  padding-left: 20px;
}
</style>