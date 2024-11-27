<template>
    <div class="q-pa-sm">
        <q-card class="cocktail-card" flat >
            <q-card-section class="header-container">
                <div class="header-content">
                    <div class="card-title">{{ name }}</div>
                    <q-rating v-model="model" max="5" color="white" icon="fa-regular fa-star"
                        icon-selected="fa-solid fa-star" icon-half="fa-solid fa-star-half" />
                </div>
                <q-btn flat round color="red" icon="fa-solid fa-heart" />
            </q-card-section>
            <img class="card-image" :src="image" :alt="name" @click="goToCocktailDetail">
        </q-card>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


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
    rating: {
        type: Number,
        required: false,
        default: 0
    }
})

const goToCocktailDetail = () => {
    router.push(`/cocktails/${props.id}`)
}
</script>

<style scoped>
.cocktail-card {
    width: 100%;
    border-radius: 2.5rem;
}

.header-container {
    display: flex;
    justify-content: space-between;
    background-color: var(--primary-color);
}

.header-content {
    display: flex;
    flex-direction: column;
    /* Titre et rating empilés verticalement */
    gap: 0.5rem;
    /* Espacement entre le titre et le rating */
    margin: 0.5rem;
}

.card-title {
    font-family: var(--heading-font-family);
    font-weight: var(--heading-font-weight);
    color: var(--background-color);
    font-size: 2rem;
    /* Mobile first */
}

.card-image {
    width: 100%;
    height: 20rem;
    object-fit: cover;
}

.cocktail-card {
    transition: transform 0.2s;
}

.cocktail-card:hover {
    transform: scale(1.02);
}
</style>