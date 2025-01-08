<template>
  <div class="cocktail-page">
    <!-- Image Principale -->
    <div class="cocktail-image">
      <img :src="cocktail.image_url" alt="Cocktail Image" />
    </div>

    <!-- Nom et Description -->
    <div class="cocktail-header">
  <h1 class="header-title">
    {{ cocktail.name }}
    <span class="favorite" @click="toggleFavorite">
      <i :class="favoriteIcon"></i>
    </span>
  </h1>
  <div class="cocktail-rating">
    <i class="fa-solid fa-star star"></i>
    <span>{{ cocktail.rank }}/5</span>
  </div>
</div>

    <div class="cocktail-description">
      <p>{{ cocktail.description }}</p>
    </div>

    <!-- Boutons Instructions et Ingrédients -->
    <div class="cocktail-tabs">
      <button class="tab" :class="{ active: activeTab === 'instructions' }" @click="activeTab = 'instructions'">Instructions</button>
      <button class="tab" :class="{ active: activeTab === 'ingredients' }" @click="activeTab = 'ingredients'">Ingrédients</button>
    </div>

    <!-- Contenu dynamique -->
    <div v-if="activeTab === 'instructions'" class="cocktail-instructions">
      <h2>Instructions</h2>
      <ol>
        <li v-for="(instruction, index) in cocktail.instructions.split('. ')" :key="index">
          {{ instruction }}.
        </li>
      </ol>
    </div>

    <div v-if="activeTab === 'ingredients'" class="cocktail-ingredients">
      <h2>Ingrédients</h2>
      <ul>
        <li v-for="(ingredient, index) in cocktail.ingredients" :key="index">
          {{ ingredient }}
        </li>
      </ul>
    </div>

    <!-- Appel à Action -->
    <div class="cta">
      <h2>Venez le tester !</h2>
      <div class="map-placeholder">
        <!-- Carte -->
        <img
          src="https://via.placeholder.com/400x300?text=Map"
          alt="Carte pour trouver un bar"
        />
        <button class="btn-find-bar">Trouver un bar</button>
      </div>
    </div>

    <!-- Barre de Navigation -->
    <nav class="bottom-nav">
      <button>🏠 Accueil</button>
      <button>💬 Chat</button>
      <button>❤️ Favoris</button>
      <button>👤 Profil</button>
    </nav>
  </div>
</template>

<style scoped>
/* Global */
.cocktail-page {
  font-family: var(--body-font-family);
  color: var(--text-color);
  background-color: #fff;
}

/* Image Principale réduite à un tiers */
.cocktail-image img {
  width: 100%;
  height: 33.33%; /* Réduit la hauteur à un tiers de la taille actuelle */
  object-fit: cover; /* Garde les proportions de l'image */
  border-bottom-left-radius: 1.25rem;
  border-bottom-right-radius: 1.25rem;
}

/* En-tête */
.cocktail-header {
  font-weight: bold; /* Met le titre en gras */
  font-size: 2.5rem; /* Ajuste la taille du titre si nécessaire */
  margin: 0; /* Enlève les marges par défaut du <h1> */
  color: var(--text-color); /* Couleur du texte */
  text-align: center;
  margin-top: 0.625rem; /* 10px en rem */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cocktail-header h1 {
  font-family: var(--heading-font-family);
  font-weight: var(--heading-font-weight);
  font-size: 2.5rem; /* 2.5em reste inchangé */
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
  gap: 0.2rem; /* Espace entre l'étoile et le texte */
  font-size: 1.2rem;
  color: var(--text-color); /* Couleur du texte */
  font-weight: normal;
  margin-top: 0.625rem; /* 10px en rem */
}

.cocktail-rating .star {
  margin-right: 0.25rem;
  color: gold;
}

/* Bouton Favori */
.favorite {
  margin-left: 0.625rem; /* 10px en rem */
  cursor: pointer;
  transition: transform 0.3s, color 0.3s; /* Ajout d'une transition fluide */
}

.favorite i {
  font-size: 1.8rem; /* Augmente la taille du cœur */
  color: var(--primary-color);
}

/* Description */
.cocktail-description {
  text-align: center;
  padding: 0.625rem 1.25rem; /* 10px 20px en rem */
  font-size: 1.2rem; /* 1.2em reste inchangé */
  color: var(--text-color);
}

/* Onglets Instructions/Ingredients */
.cocktail-tabs {
  display: flex;
  justify-content: center;
  margin: 0.625rem 0; /* 10px en rem */
}

.tab {
  background-color: var(--background-color); /* Couleur par défaut pour les non-actifs */
  color: var(--text-color); /* Couleur du texte par défaut */
  border: none;
  border-radius: 1.25rem; /* 20px en rem */
  margin: 0 0.3125rem; /* 5px en rem */
  padding: 0.5rem 1rem; /* 8px 16px en rem */
  cursor: pointer;
  font-size: 1rem; /* 1em reste inchangé */
}

.tab.active {
  background-color: var(--primary-color); /* Couleur pour l'onglet actif */
  color: white; /* Couleur du texte pour l'onglet actif */
}

/* Liste des Ingrédients */
.cocktail-ingredients {
  margin: 0.625rem 1.25rem; /* 10px 20px en rem */
}

.cocktail-ingredients ul {
  list-style: none;
  padding: 0;
}

.cocktail-ingredients li {
  margin: 0.5rem 0; /* 8px en rem */
  font-size: 1.2rem; /* 1.2em reste inchangé */
  color: var(--text-color);
}

/* Instructions */
.cocktail-instructions {
  margin: 0.625rem 1.25rem; /* 10px 20px en rem */
}

.cocktail-instructions ol {
  padding-left: 1.25rem; /* 20px en rem */
}

.cocktail-instructions li {
  margin: 0.5rem 0; /* 8px en rem */
  font-size: 1.2rem; /* 1.2em reste inchangé */
  color: var(--text-color);
}

/* Carte et Bouton */
.cta {
  text-align: center;
  margin: 1.25rem 0; /* 20px en rem */
}

.map-placeholder {
  position: relative;
}

.map-placeholder img {
  width: 100%;
  border-radius: 0.75rem; /* 12px en rem */
}

.btn-find-bar {
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 1.25rem; /* 20px en rem */
  padding: 0.625rem 1.25rem; /* 10px 20px en rem */
  position: absolute;
  bottom: 0.625rem; /* 10px en rem */
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  font-size: 1rem; /* 1em reste inchangé */
}

/* Barre de Navigation */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  background-color: #f5f5f5;
  padding: 0.625rem 0; /* 10px en rem */
  border-top: 0.0625rem solid #ddd; /* 1px en rem */
  position: fixed;
  bottom: 0;
  width: 100%;
}

.bottom-nav button {
  background: none;
  border: none;
  font-size: 1.2rem; /* 1.2em reste inchangé */
  color: var(--text-color);
  cursor: pointer;
}

.bottom-nav button:focus {
  color: var(--primary-color);
}
</style>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useFetchApiCrud } from "../composables/useFetchApiCrud";
import { isAuthenticated } from "../store/user";

// Exemple de données pour le cocktail
const cocktail = {
  _id: "12345",
  name: "Tequila Sunrise",
  description:
    "Un cocktail rafraîchissant et ensoleillé qui mêle douceur et exotisme dans chaque gorgée !",
  image_url:
    "https://media.istockphoto.com/id/1307546222/fr/photo/cocktail-mojito-à-la-lime-et-à-la-menthe.jpg?s=1024x1024&w=is&k=20&c=ZUP7rDH6Gq_wg-CKHWGo9sZ1MkWHY42-zP4ogK3dHYU=",
  instructions: "Mélangez la tequila et le jus d'orange. Ajoutez la grenadine. Décorez avec une tranche d'orange et une cerise.",
  ingredients: [
    "4 cl de tequila",
    "12 cl de jus d'orange",
    "2 cl de grenadine",
    "Glaçons",
    "1 tranche d'orange (pour la décoration)",
    "1 cerise (pour la décoration)",
  ],
  rank: 4.7,
};

// Gestion des onglets actifs
const activeTab = ref("instructions");

// Gestion des favoris
const isHovered = ref(false);
const isFavorite = ref(false);

const favoriteIcon = computed(() => {
  return isFavorite.value ? "fa-solid fa-heart" : "fa-regular fa-heart";
});

const favoritesApi = useFetchApiCrud("users/me/favorites", import.meta.env.VITE_API_URL);

const checkFavorite = async () => {
  if (isAuthenticated.value) {
    // Vérifiez si le cocktail est déjà dans les favoris
    const response = await favoritesApi.read(cocktail._id);
    isFavorite.value = response.data.includes(cocktail._id);
  }
};

const emit = defineEmits(["remove-favorite"]);

const toggleFavorite = async () => {
  if (!isAuthenticated.value) {
    // Redirigez vers la page de connexion ou affichez un message
    return;
  }

  if (isFavorite.value) {
    // Supprimez des favoris
    await favoritesApi.delete(cocktail._id);
    isFavorite.value = false;
    emit("remove-favorite", cocktail._id);
  } else {
    // Ajoutez aux favoris
    await favoritesApi.create(cocktail._id);
    isFavorite.value = true;
  }
};

onMounted(checkFavorite);
</script>