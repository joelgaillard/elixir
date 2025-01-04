<template>
  <div class="container">
    <h1>Cocktails</h1>
    <div class="toolbar">
      <div class="search-bar">
        <SearchBar @search-results="handleSearchResults" @reset-search="resetSearch" />
      </div>
      <div class="dropdown-filter">
        <DropdownFilter :default-text="'Filtrer par ingrédients'" :options="ingredients" @filter-selected="handleFilter"
          @reset-filters="resetFilters" />
      </div>
      <div class="dropdown-sort">
        <DropdownSort 
        :options="sortOptions" 
        @sort-selected="handleSort"
      />
      </div>
    </div>

  </div>
  <div class="cocktail-grid">
    <div v-for="cocktail in cocktails" :key="cocktail._id" class="cocktail-card">
      <CocktailCard :id="cocktail._id" :name="cocktail.name" :image="cocktail.image_url" :rank="cocktail.rank" :ratings-count="cocktail.ratingsCount" />
    </div>
  </div>
  <div class="pagination">
  <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="handlePageChange" />
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CocktailCard from '../components/CocktailCard.vue'
import { useFetchApiCrud } from '../composables/useFetchApiCrud'
import SearchBar from '../components/SearchBar.vue'
import DropdownFilter from '../components/DropdownFilter.vue'
import DropdownSort from '../components/DropdownSort.vue'
import Pagination from '../components/Pagination.vue'

const cocktails = ref([])
const ingredients = ref([])
const error = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref(null)
const selectedIngredients = ref([])
const selectedSort = ref(null);
const sortOrder = ref('desc') // Par défaut, ordre descendant

const sortOptions = ref([
  { value: 'name', label: 'Nom' },
  { value: 'rank', label: 'Popularité' },
  { value: 'createdAt', label: 'Date de création' }
]);

const router = useRouter()
const cocktailCrud = useFetchApiCrud('cocktails', import.meta.env.VITE_API_URL)
const ingredientsCrud = useFetchApiCrud('ingredients', import.meta.env.VITE_API_URL)

async function fetchCocktails() {
  try {
    let url = `cocktails?page=${currentPage.value}`
    
    if (selectedSort.value) {
      url += `&sort=${selectedSort.value}&order=${sortOrder.value}`
    }
    
    if (selectedIngredients.value.length > 0) {
      url += `&ingredients=${selectedIngredients.value.join(',')}`
    }
    
    if (searchQuery.value) {
      url += `&name=${searchQuery.value}`
    }

    const data = await cocktailCrud.fetchApi({
      url,
      method: 'GET',
    })

    cocktails.value = data.cocktails
    totalPages.value = data.pagination.totalPages
  } catch (e) {
    error.value = true
    console.error('Erreur lors de la récupération des cocktails:', e)
  }
}

async function fetchIngredients() {
  try {
    const data = await ingredientsCrud.fetchApi({
      url: 'ingredients',
      method: 'GET'
    })
    ingredients.value = data;
  } catch (e) {
    console.error('Erreur lors de la récupération des ingrédients:', e)
  }
}

const handleFilter = (ingredients) => {
  selectedIngredients.value = ingredients
  currentPage.value = 1
  fetchCocktails()
}

const resetFilters = () => {
  selectedIngredients.value = []
  currentPage.value = 1
  fetchCocktails()
}

const handleSort = (sortOption) => {
  selectedSort.value = sortOption; // sortOption sera la "value" (en anglais)
  sortOrder.value = sortOption === 'name' ? 'asc' : 'desc'; // Exemple de logique pour l'ordre
  currentPage.value = 1;
  fetchCocktails(); // Requête avec les valeurs en anglais
};

const handlePageChange = (page) => {
  currentPage.value = page
  fetchCocktails()
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchCocktails()
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchCocktails()
  }
}

function goToLogin() {
  router.push({ name: 'Login' })
}

const handleSearchResults = (results, query) => {
  searchQuery.value = query
  currentPage.value = 1
  fetchCocktails()
}

function resetSearch() {
  searchQuery.value = null
  currentPage.value = 1
  fetchCocktails()
}

// Initialisation des données
onMounted(() => {
  fetchCocktails()
  fetchIngredients()
})
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


.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

}

/* Largeurs spécifiques des éléments */
.search-bar {
  flex: 2 1 60%;
  /* Recherche occupe 50% en grand écran */
}

.dropdown-filter,
.dropdown-sort {
  flex: 1 1 20%;
  /* Chaque menu occupe 25% en grand écran */
}

/* Petit écran : chaque élément prend 100% */
@media (max-width: 767px) {
  .toolbar>* {
    flex: 1 1 100%;
    /* Chaque élément occupe toute la largeur */
  }
}

/* Écran moyen : recherche sur une ligne, filtres sur une autre */
@media (min-width: 768px) and (max-width: 1023px) {
  .search-bar {
    flex: 1 1 100%;
    /* Recherche occupe toute la largeur */
  }

  .dropdown-filter,
  .dropdown-sort {
    flex: 1 1 48%;
    /* Chaque filtre prend 50% */
  }
}

/* Grand écran : tout aligné horizontalement */
@media (min-width: 1024px) {
  .toolbar {
    flex-wrap: nowrap;
    /* Tout reste sur une seule ligne */
  }
}
</style>