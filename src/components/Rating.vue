<template>
  <div class="rating-component">
    <div class="close-button" @click="closePopup">
      <i class="fa-solid fa-x"></i>
    </div>
    <div class="content">
      <h2>Notation du cocktail</h2>
      <!-- Étoiles -->
      <div class="stars">
        <i v-for="star in 5" :key="star" :class="getStarClass(star)" @click="selectRating(star)"
          @mouseover="hoverRating(star)" @mouseleave="resetHover" class="star"></i>
      </div>
    </div>

    <!-- Bouton pour soumettre -->
    <button class="submit-button" :disabled="selectedRating === 0" @click="submitRating">
      Poster l'avis
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  showRatingPopup: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "submit-rating"]);

const selectedRating = ref(0);

const hoverValue = ref(0);

const getStarClass = (star) => {
  if (hoverValue.value >= star) {
    return "fa-solid fa-star";
  } else if (selectedRating.value >= star) {
    return "fa-solid fa-star";
  } else {
    return "fa-regular fa-star";
  }
};

const selectRating = (star) => {
  selectedRating.value = star;
};

const hoverRating = (star) => {
  hoverValue.value = star;
};

const resetHover = () => {
  hoverValue.value = 0;
};

const closePopup = () => {
  emit("close");
};

const submitRating = () => {
  emit("submit-rating", selectedRating.value);
};
</script>


<style scoped>
.rating-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--background-color);
  padding: 1rem;
}

h2 {
  margin: 0;
  padding-bottom: 1rem;

}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.stars {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.star {
  font-size: 2rem;
  color: gold;
  cursor: pointer;
}

.submit-button {
  background-color: var(--text-color);
  color: #fff;
  border: none;
  border-radius: 1.25rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #555;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.close-button {
  align-self: flex-end;
  cursor: pointer;
}
</style>