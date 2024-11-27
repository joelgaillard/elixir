<!-- views/Cocktail.vue -->
<template>
    <div>
        <p>        Id: {{ cocktail._id }}</p>
        <p>        Name: {{ cocktail.name }}</p>
        <p>        Description: {{ cocktail.description }}</p>
        <p>        Instructions: {{ cocktail.instructions }}</p>
        <p>        URL Image: {{ cocktail.image_url }}</p>
        <p>        Ingredients: {{ cocktail.ingredients }}</p>
        <p>        Rank: {{ cocktail.rank }}</p>

    
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