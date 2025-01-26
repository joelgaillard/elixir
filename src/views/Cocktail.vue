<template>
  <div class="cocktail-page" v-if="!isLoading">

    <div class="cocktail-image">
      <img :src="cocktail.value.image_url" alt="Cocktail Image" />
    </div>

    <div class="header-element cocktail-header">
      <h1 class="header-title">
        {{ cocktail.value.name }}
        <div class="favorite">
          <i :class="favoriteIcon" @click.stop="toggleFavorite" @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave"></i>
        </div>
      </h1>
      <div class="header-element cocktail-rating">
        <i class="fa-solid fa-star star"></i>
        <span>{{ roundRank(cocktail.value.rank) }}/5 ({{ cocktail.value.ratingsCount }})</span>
        <div>
          <button class="rating-button" @click="displayRatingPopUp">Noter le cocktail</button>

          <div v-if="showRatingPopup" class="rating-popup">
            <div class="popup-overlay" @click="closeRatingPopup"></div>
            <div class="popup-content">
              <Rating @close="closeRatingPopup" @submit-rating="handleSubmitRating" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cocktail-description">
      <p>{{ cocktail.value.description }}</p>
    </div>

    <div class="cocktail-tabs">
      <button class="tab" :class="{ active: activeTab === 'instructions' }" @click="setActiveTab('instructions')">
        Instructions
      </button>
      <button class="tab" :class="{ active: activeTab === 'ingredients' }" @click="setActiveTab('ingredients')">
        Ingrédients
      </button>
    </div>

    <div v-if="activeTab === 'instructions'" class="cocktail-instructions">
      <ul>
        <li v-for="(instruction, index) in cocktail.value.instructions" :key="index">
          {{ index + 1 }}. {{ instruction }}
        </li>
      </ul>
    </div>
    <div v-if="activeTab === 'ingredients'" class="cocktail-ingredients">
      <ul>
        <li v-for="(ingredient, index) in cocktail.value.ingredients" :key="index">
          {{ ingredient.quantity ? `${ingredient.quantity} ` : '' }}{{ ingredient.unit ? `${ingredient.unit} de` : '' }}
          {{ ingredient.name }}
        </li>
      </ul>
    </div>

    <div class="cta">
      <h2>Venez le tester !</h2>

      <div class="map-container">
        <Map v-if="!isLoadingBars" :bars="bars" />
      </div>
    </div>

    <Status v-if="showStatus" message="Votre avis a été ajouté" type="success" class="status-message" />
  </div>
  <div v-else>
    <Loading />
  </div>

</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useFetchApiCrud } from "../composables/useFetchApiCrud";
import Rating from "../components/Rating.vue";
import Status from "../components/Status.vue";
import { isAuthenticated } from "../store/user";
import Loading from "../components/Loading.vue";
import Map from "../components/Map.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const cocktailCrud = useFetchApiCrud("cocktails", import.meta.env.VITE_API_URL);
const favoritesApi = useFetchApiCrud("users/me/favorites", import.meta.env.VITE_API_URL);
const barsCrud = useFetchApiCrud('bars', import.meta.env.VITE_API_URL)

const cocktail = ref({});
const bars = ref([]);
const isLoading = ref(true);
const isLoadingBars = ref(true);

const isFavorite = ref(false);
const isHovered = ref(false);
const isMobile = ref(false);

onMounted(async () => {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent);
  await loadCocktailData();
  await checkFavorite();
});

const loadCocktailData = async () => {
  try {
    const response = await cocktailCrud.read(props.id);
    cocktail.value = response.data;
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const checkFavorite = async () => {
  if (isAuthenticated.value) {
    try {
      const response = await favoritesApi.fetchApi({
        url: `users/me/favorites/${props.id}`,
        method: "GET",
      });
      isFavorite.value = !!response._id;
    } catch (error) {
    }
  }
};

const toggleFavorite = async () => {
  if (!isAuthenticated.value) {
    alert("Vous devez être connecté pour gérer les favoris.");
    return;
  }
  try {
    if (isFavorite.value) {
      await favoritesApi.fetchApi({
        url: `users/me/favorites/${props.id}`,
        method: "DELETE",
      });
      isFavorite.value = false;
    } else {
      await favoritesApi.fetchApi({
        url: "users/me/favorites",
        method: "POST",
        data: { cocktail_id: props.id },
      });
      isFavorite.value = true;
    }
  } catch (error) {
  }
};

const favoriteIcon = computed(() => {
  if (isHovered.value) {
    return isFavorite.value ? "fa-regular fa-heart" : "fa-solid fa-heart";
  }
  return isFavorite.value ? "fa-solid fa-heart" : "fa-regular fa-heart";
});

const handleMouseOver = () => {
  if (!isMobile.value) {
    isHovered.value = true;
  }
};

const handleMouseLeave = () => {
  if (!isMobile.value) {
    isHovered.value = false;
  }
};

const activeTab = ref("instructions");
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const showRatingPopup = ref(false);

const displayRatingPopUp = () => {
  if (!isAuthenticated.value) {
    alert("Vous devez être connecté pour noter un cocktail.");
    return;
  }
  showRatingPopup.value = true;
};

const closeRatingPopup = () => {
  showRatingPopup.value = false;
};

const handleSubmitRating = async (rating) => {
  try {
    await cocktailCrud.fetchApi({
      url: `/cocktails/${props.id}/ratings`,
      data: { rating },
      method: "PUT",
    });

    const updatedCocktail = await cocktailCrud.read(props.id);
    cocktail.value = updatedCocktail.data;

    closeRatingPopup();
    displayStatus();
  } catch (error) {
  }
};

const showStatus = ref(false);

const displayStatus = () => {
  showStatus.value = true;
  setTimeout(() => {
    showStatus.value = false;
  }, 2500);
};

const roundRank = (rank) => Math.round(rank * 10) / 10 || 0;

async function fetchBars() {
  isLoadingBars.value = true
  try {
    const data = await barsCrud.fetchApi({
      url: '/bars',
      method: 'GET',
    })


    bars.value = data
  } catch (e) {
    error.value = true
  } finally {
    isLoadingBars.value = false
  }
}

onMounted(() => {
  fetchBars()
})


</script>



<style scoped>
.cocktail-page {
  font-family: var(--body-font-family);
  color: var(--text-color);
  background-color: #fff;
}

.status-message {
  width: 92%;
  position: fixed;
  margin-bottom: 1rem;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}


.cocktail-image img {
  width: 100%;
  height: 33.33%;
  max-height: 20rem;
  object-fit: cover;
  border-bottom-left-radius: 1.25rem;
  border-bottom-right-radius: 1.25rem;
}

.cocktail-header {
  font-weight: bold;
  font-size: 2.5rem;
  margin: 0;
  color: var(--text-color);
  text-align: center;
  margin-top: 0.625rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cocktail-header h1 {
  font-family: var(--heading-font-family);
  font-weight: var(--heading-font-weight);
  font-size: 2.5rem;
  margin: 0;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cocktail-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  font-size: 1.2rem;
  color: var(--text-color);
  font-weight: normal;
  margin-top: 0.625rem;
}

.cocktail-rating .star {
  margin-right: 0.25rem;
  color: gold;
}

.favorite {
  margin-left: 0.625rem;
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;
}

.favorite i {
  font-size: 1.8rem;
  color: var(--primary-color);
}

.cocktail-description {
  text-align: center;
  padding: 0.625rem 1.25rem;
  font-size: 1.2rem;
  color: var(--text-color);
}

.cocktail-tabs {
  display: flex;
  justify-content: center;
  margin: 0.625rem 0;
}

.tab,
.rating-button {
  background-color: var(--background-color);
  color: var(--text-color);
  font-weight: bold;
  border: none;
  border-radius: 1.25rem;
  margin: 0 0.3125rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
}

.rating-button {
  background-color: gold;
  color: var(--text-color);
}

.tab.active {
  background-color: var(--primary-color);
  color: white;
}

.cocktail-ingredients {
  margin: 0.625rem 1.25rem;
}

.cocktail-ingredients ul {
  list-style: none;
  padding: 0;
}

.cocktail-ingredients li {
  margin: 0.5rem 0;
  font-size: 1.2rem;
  color: var(--text-color);
}

.cocktail-instructions li {
  margin: 0.5rem 0;
  font-size: 1.2rem;
  color: var(--text-color);
}

.cta {
  text-align: center;
  margin: 1.25rem 0;
}

.rating-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: relative;
}

button {
  cursor: pointer;
}
</style>
