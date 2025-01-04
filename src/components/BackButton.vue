<template>

  <div @click="goBack" class="back-button">
    <i class="fa-solid fa-angle-left"></i>
  </div>

</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.go(-1);
}
</script>

<style scoped>
.back-button {
  color: var(--primary-color);
  font-size: 1.8rem;
}

.back-button:hover {
color: var(--accent-color);
cursor: pointer;
}
</style>