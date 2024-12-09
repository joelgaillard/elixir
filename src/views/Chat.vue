<template>
    <div>
      <h1>Chat</h1>
      <p>Bienvenue sur la page d'accueil !</p>
      <ChatMessage />
    </div>
  </template>
  
  <script>
  import ChatMessage from '../components/ChatMessage.vue';
  export default {
    name: 'Chat',
    components: {
      ChatMessage
    }
  };
  </script>