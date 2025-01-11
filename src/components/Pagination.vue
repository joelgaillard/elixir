<template>
    <div class="pagination-container">
      <button class="pagination-button" @click="prevPage" :disabled="currentPage === 1">
        <i class="fa-solid fa-angle-left"></i>
      </button>
      <div class="pagination">
        <button v-for="page in pages" :key="page" @click="goToPage(page)" :class="['pagination-number', { 'active': page === currentPage }]">
          {{ page }}
        </button>
      </div>
      <button class="pagination-button" @click="nextPage" :disabled="currentPage === totalPages">
        <i class="fa-solid fa-angle-right"></i>
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  });
  
  const emit = defineEmits(['page-changed']);
  
  const pages = computed(() => {
    const range = [];
    for (let i = 1; i <= props.totalPages; i++) {
      range.push(i);
    }
    return range;
  });
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const goToPage = (page) => {
    emit('page-changed', page);
    scrollToTop();
  };
  
  const prevPage = () => {
    if (props.currentPage > 1) {
      emit('page-changed', props.currentPage - 1);
      scrollToTop();
    }
  };
  
  const nextPage = () => {
    if (props.currentPage < props.totalPages) {
      emit('page-changed', props.currentPage + 1);
      scrollToTop();
    }
  };
  </script>
  
  
  <style scoped>
  .pagination-container {
    display: flex;
    margin-top: 1rem;
    margin-bottom: 1rem;
        justify-content: center;
    align-items: center;
  }
  
  .pagination-button {
    width: 2rem;
    height: 2rem;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--primary-color);
  }
  
  .pagination-button:disabled {
    cursor: not-allowed;
    color: #ccc;
  }
  
  .pagination {
    display: flex;
    gap: 0.5rem;
  }
  
  .pagination-number {
    padding: 0.5rem 1rem;
    background-color: var(--color-background);
    border-radius: 80rem;
    aspect-ratio: 1;
    border: none;
    cursor: pointer;
    color: var(--primary-color);
  }
  
  .pagination-number.active {
    background-color: #f0f0f0;
    font-weight: bold;
  }
  </style>