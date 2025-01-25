<template>
  <div class="cocktail-card" @click="goToCocktailDetail">
    <div class="image" :style="{ backgroundImage: `url(${image})` }"></div>
    <div class="infos-container">
      <div class="infos">
        <div class="title">{{ name }}</div>
        <div class="rating"> <i class="fa-solid fa-star"></i> {{ roundRank(rank) }}/5 ({{ ratingsCount }}) </div>
      </div>
      <div class="favorite">
        <i :class="favoriteIcon" @click.stop="toggleFavorite"
          @mouseover="!isMobile && (isHovered = true)"
          @mouseleave="!isMobile && (isHovered = false)"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useFetchApiCrud } from '../composables/useFetchApiCrud'
import { isAuthenticated } from '../store/user'

const router = useRouter()
const isHovered = ref(false)
const isFavorite = ref(false)
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent)
})

// Définition des props avec validation
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  ratingsCount: {
    type: Number,
    required: true
  }
})

const favoriteIcon = computed(() => {
  if (isHovered.value) {
    return isFavorite.value ? 'fa-regular fa-heart' : 'fa-solid fa-heart'
  }
  return isFavorite.value ? 'fa-solid fa-heart' : 'fa-regular fa-heart'
})

const favoritesApi = useFetchApiCrud('users/me/favorites', import.meta.env.VITE_API_URL)

const checkFavorite = async () => {
  if (isAuthenticated.value) {
    try {
      const response = await favoritesApi.fetchApi({
        url: `users/me/favorites/${props.id}`,
        method: 'GET'
      })
      isFavorite.value = !!response._id
    }
    catch (e) {
    }
  }
}

const emit = defineEmits(['remove-favorite'])

const toggleFavorite = async () => {
  if (!isAuthenticated.value) {
    alert('Vous devez être connecté pour ajouter des favoris.')
    return
  }

  if (isFavorite.value) {
    await favoritesApi.fetchApi({
      url: `users/me/favorites/${props.id}`,
      method: 'DELETE'
    })
    isFavorite.value = false
    emit('remove-favorite', props.id)
  } else {
    await favoritesApi.fetchApi({
      url: 'users/me/favorites',
      method: 'POST',
      data: { cocktail_id: props.id }
    })
    isFavorite.value = true
  }

}

function roundRank(rank) {
  return Math.round(rank * 10) / 10;
}



onMounted(checkFavorite)

const goToCocktailDetail = () => {
  router.push(`/cocktails/${props.id}`)
}
</script>

<style scoped>
.cocktail-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 1rem;
}

.image {
  width: 100%;
  background-size: cover;
  background-position: center;
  aspect-ratio: 5/4;
  border-radius: 1rem 1rem 0 0;
}

.infos-container {
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  padding-bottom: 0.25rem;
}

.rating i {
  margin-right: 0.25rem;
  color: gold;
}


.favorite {
  display: flex;
  align-self: flex-end;
  cursor: pointer;
}

.favorite i {
  font-size: 1.8rem;
  /* Augmente la taille du cœur */
  color: var(--primary-color);
  /* Facultatif : couleur du cœur */
  align-items: flex-end;
}

/* Augmenter la taille du texte lorsque la grille est en une seule colonne */
@media (max-width: 399px) {
  .title {
    font-size: 1.8rem;
  }

  .favorite i {
    font-size: 2rem;
  }
}
</style>