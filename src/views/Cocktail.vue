<template>
  <div class="cocktail-page" v-if="!isLoading">
    <!-- Image principale -->
    <div class="cocktail-image">
      <img :src="cocktail.value.image_url" alt="Cocktail Image" />
    </div>

    <!-- Nom et description -->
    <div class="header-element cocktail-header">
      <h1 class="header-title">
        {{ cocktail.value.name }}
        <div class="favorite">
          <i :class="favoriteIcon" @click.stop="toggleFavorite" @mouseover="handleMouseOver" @mouseleave="handleMouseLeave"></i>
        </div>
      </h1>
      <div class="header-element cocktail-rating">
        <i class="fa-solid fa-star star"></i>
        <span>{{ roundRank(cocktail.value.rank) }}/5 ({{ cocktail.value.ratingsCount }})</span>
        <div>
          <button class="rating-button" @click="displayRatingPopUp">Noter le cocktail</button>

          <!-- Pop-up de notation -->
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

    <!-- Onglets Instructions et Ingrédients -->
    <div class="cocktail-tabs">
      <button class="tab" :class="{ active: activeTab === 'instructions' }" @click="setActiveTab('instructions')">
        Instructions
      </button>
      <button class="tab" :class="{ active: activeTab === 'ingredients' }" @click="setActiveTab('ingredients')">
        Ingrédients
      </button>
    </div>

    <!-- Contenu dynamique -->
    <div v-if="activeTab === 'instructions'" class="cocktail-instructions">
      <ol>
        <li v-for="(instruction, index) in cocktail.value.instructions" :key="index">
          {{ index + 1 }}. {{ instruction }}
        </li>
      </ol>
    </div>
    <div v-if="activeTab === 'ingredients'" class="cocktail-ingredients">
      <ul>
        <li v-for="(ingredient, index) in cocktail.value.ingredients" :key="index">
          {{ ingredient.quantity ? `${ingredient.quantity} ` : '' }}{{ ingredient.unit ? `${ingredient.unit} de` : '' }}
          {{ ingredient.name }}
        </li>
      </ul>
    </div>

    <!-- Carte et appel à l'action -->
    <div class="cta">
      <h2>Venez le tester !</h2>
      <div class="map-placeholder">
        <img src="https://via.placeholder.com/400x300?text=Map" alt="Carte pour trouver un bar" />
        <button class="btn-find-bar">Trouver un bar</button>
      </div>
    </div>

    <Status v-if="showStatus" message="Votre avis a été ajouté" type="success" class="status-message" />
  </div>

    <Loading v-else />

</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useFetchApiCrud } from "../composables/useFetchApiCrud";
import Rating from "../components/Rating.vue";
import Status from "../components/Status.vue";
import { isAuthenticated } from "../store/user";
import Loading from "../components/Loading.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

// Initialisation des données
const cocktailCrud = useFetchApiCrud("cocktails", import.meta.env.VITE_API_URL);
const favoritesApi = useFetchApiCrud("users/me/favorites", import.meta.env.VITE_API_URL);
const cocktail = ref({});
const isLoading = ref(true); // État de chargement

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
</script>



<style scoped>
/* Global */
.cocktail-page {
  font-family: var(--body-font-family);
  color: var(--text-color);
  background-color: #fff;
}

.status-message {
  width: 92%;
  position: fixed;
  margin-bottom: 1rem;
  bottom: 4rem; /* Ajustez cette valeur pour qu'elle soit au-dessus de la barre de navigation */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}


/* Image Principale réduite à un tiers */
.cocktail-image img {
  width: 100%;
  height: 33.33%;
  max-height: 20rem;
  /* Réduit la hauteur à un tiers de la taille actuelle */
  object-fit: cover;
  /* Garde les proportions de l'image */
  border-bottom-left-radius: 1.25rem;
  border-bottom-right-radius: 1.25rem;
}

/* En-tête */
.cocktail-header {
  font-weight: bold;
  /* Met le titre en gras */
  font-size: 2.5rem;
  /* Ajuste la taille du titre si nécessaire */
  margin: 0;
  /* Enlève les marges par défaut du <h1> */
  color: var(--text-color);
  /* Couleur du texte */
  text-align: center;
  margin-top: 0.625rem;
  /* 10px en rem */
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
  /* 2.5em reste inchangé */
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
  /* Espace entre l'étoile et le texte */
  font-size: 1.2rem;
  color: var(--text-color);
  /* Couleur du texte */
  font-weight: normal;
  margin-top: 0.625rem;
  /* 10px en rem */
}

.cocktail-rating .star {
  margin-right: 0.25rem;
  color: gold;
}

/* Bouton Favori */
.favorite {
  margin-left: 0.625rem;
  /* 10px en rem */
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;
  /* Ajout d'une transition fluide */
}

.favorite i {
  font-size: 1.8rem;
  /* Augmente la taille du cœur */
  color: var(--primary-color);
}

/* Description */
.cocktail-description {
  text-align: center;
  padding: 0.625rem 1.25rem;
  /* 10px 20px en rem */
  font-size: 1.2rem;
  /* 1.2em reste inchangé */
  color: var(--text-color);
}

/* Onglets Instructions/Ingredients */
.cocktail-tabs {
  display: flex;
  justify-content: center;
  margin: 0.625rem 0;
  /* 10px en rem */
}

.tab,
.rating-button {
  background-color: var(--background-color);
  /* Couleur par défaut pour les non-actifs */
  color: var(--text-color);
  font-weight: bold;
  /* Couleur du texte par défaut */
  border: none;
  border-radius: 1.25rem;
  /* 20px en rem */
  margin: 0 0.3125rem;
  /* 5px en rem */
  padding: 0.5rem 1rem;
  /* 8px 16px en rem */
  cursor: pointer;
  font-size: 1rem;
  /* 1em reste inchangé */
}

.rating-button {
  background-color: gold;
  color: var(--text-color);
}

.tab.active {
  background-color: var(--primary-color);
  /* Couleur pour l'onglet actif */
  color: white;
  /* Couleur du texte pour l'onglet actif */
}

/* Liste des Ingrédients */
.cocktail-ingredients {
  margin: 0.625rem 1.25rem;
  /* 10px 20px en rem */
}

.cocktail-ingredients ul {
  list-style: none;
  padding: 0;
}

.cocktail-ingredients li {
  margin: 0.5rem 0;
  /* 8px en rem */
  font-size: 1.2rem;
  /* 1.2em reste inchangé */
  color: var(--text-color);
}

/* Instructions */
.cocktail-instructions {
  margin: 0.625rem 1.25rem;
  /* 10px 20px en rem */
}

.cocktail-instructions ol {
  padding-left: 1.25rem;
  /* 20px en rem */
}

.cocktail-instructions li {
  margin: 0.5rem 0;
  /* 8px en rem */
  font-size: 1.2rem;
  /* 1.2em reste inchangé */
  color: var(--text-color);
}

/* Carte et Bouton */
.cta {
  text-align: center;
  margin: 1.25rem 0;
  /* 20px en rem */
}

.map-placeholder {
  position: relative;
}

.map-placeholder img {
  width: 100%;
  border-radius: 0.75rem;
  /* 12px en rem */
}

.btn-find-bar {
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 1.25rem;
  /* 20px en rem */
  padding: 0.625rem 1.25rem;
  /* 10px 20px en rem */
  position: absolute;
  bottom: 0.625rem;
  /* 10px en rem */
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  font-size: 1rem;
  /* 1em reste inchangé */
}

/* Barre de Navigation */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  background-color: #f5f5f5;
  padding: 0.625rem 0;
  /* 10px en rem */
  border-top: 0.0625rem solid #ddd;
  /* 1px en rem */
  position: fixed;
  bottom: 0;
  width: 100%;
}

.bottom-nav button {
  background: none;
  border: none;
  font-size: 1.2rem;
  /* 1.2em reste inchangé */
  color: var(--text-color);
  cursor: pointer;
}

.bottom-nav button:focus {
  color: var(--primary-color);
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
