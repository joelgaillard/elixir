<template>
    <div class="bar-container" @click="goToChat">
      <img class="bar-item image" :src="image" :alt="name" />
      <div class="bar-item name">{{ name }}</div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
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
    }
  })
  
  const goToChat = () => {
    router.push({ name: 'ChatRoom', params: { id: props.id, name: props.name, image: props.image } })
  }
  </script>
  

<style scoped>
.bar-container {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    padding: 1rem;
    background-color: var(--grey);
}

.image {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    margin-right: 1rem;
}

.name {
    font-size: 1rem;
    font-weight: bold;
}


</style>