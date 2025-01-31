<template>
  <div class="container">
    <div v-if="!isAuthenticated" class="login-container">
      <Button class="login-element" text="Se connecter" icon="fa fa-user" @click="goToLogin" />
      <router-link class="login-element" :to="{ path: '/register', query: $route.query }">S’inscrire</router-link>
    </div>

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
        <DropdownSort :options="sortOptions" @sort-selected="handleSort" />
      </div>
    </div>


    <Loading v-if="loading" label="Chargement" />


    <div v-else>
      <div class="cocktail-grid">
        <div v-for="cocktail in cocktails" :key="cocktail._id" class="cocktail-card">
          <CocktailCard :id="cocktail._id" :name="cocktail.name" :image="cocktail.image_url" :rank="cocktail.rank"
            :ratings-count="cocktail.ratingsCount" />
        </div>
      </div>
    </div>


    <div class="pagination">
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="handlePageChange" />
    </div>
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
import Loading from '../components/Loading.vue'
import Button from '../components/Button.vue'
import { isAuthenticated } from '../store/user'


const cocktails = ref([])
const ingredients = ref([])
const loading = ref(false)
const error = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref(null)
const selectedIngredients = ref([])
const selectedSort = ref(null);
const sortOrder = ref('desc')

const sortOptions = ref([
  { value: 'name', label: 'Nom' },
  { value: 'rank', label: 'Popularité' },
  { value: 'createdAt', label: 'Date de création' }
]);

const router = useRouter()
const cocktailCrud = useFetchApiCrud('cocktails', import.meta.env.VITE_API_URL)
const ingredientsCrud = useFetchApiCrud('ingredients', import.meta.env.VITE_API_URL)

async function fetchCocktails() {
  loading.value = true
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
  } finally {
    loading.value = false
  }
}

async function fetchIngredients() {
  try {
    const data = await ingredientsCrud.fetchApi({
      url: 'ingredients',
      method: 'GET',
    })
    ingredients.value = data
  } catch (e) {
    error.value = true
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
  selectedSort.value = sortOption;
  sortOrder.value = sortOption === 'name' ? 'asc' : 'desc';
  currentPage.value = 1;
  fetchCocktails();
};

const handlePageChange = (page) => {
  currentPage.value = page
  fetchCocktails()
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

onMounted(() => {
  fetchCocktails()
  fetchIngredients()
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 1rem;
  font-weight: bold;
  font-size: 1rem;
  align-items: center;
}


.login-element {
  font-family: var(--sen-bold);

}


.cocktail-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media screen and (max-width: 767px) {
  .login-container {
    justify-content: space-between;
    flex-direction: row-reverse;
  }


}

@media (min-width: 400px) and (max-width: 767px) {
  .cocktail-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .cocktail-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) and (max-width: 1439px) {
  .cocktail-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1440px) {
  .cocktail-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
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

.search-bar {
  flex: 2 1 60%;
}

.dropdown-filter,
.dropdown-sort {
  flex: 1 1 20%;
}

@media (max-width: 767px) {
  .toolbar>* {
    flex: 1 1 100%;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .search-bar {
    flex: 1 1 100%;
  }

  .dropdown-filter,
  .dropdown-sort {
    flex: 1 1 48%;
  }
}

@media (min-width: 1024px) {
  .toolbar {
    flex-wrap: nowrap;
  }
}
</style>