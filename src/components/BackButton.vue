<template>
    <button @click="goBack" class="back-button">
      ← Retour
    </button>
  </template>
  
  <script>
  export default {
    name: "BackButton",
    methods: {
      goBack() {
        // Vérifie si un historique est disponible
        if (window.history.length > 1) {
          window.history.back();
        } else {
          this.$router.push('/'); // Redirige vers une page par défaut si aucun historique
        }
      }
    }
  };
  </script>
  
  <style scoped>
 .back-button {
  background-color: #ffaf72;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background-color: #35495e;
  transform: scale(1.05);
}

.back-button:active {
  background-color: #35495e;
}
  </style>
  