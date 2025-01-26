<template>
  <div v-if="isAuthenticated" class="chat-container">
    <div class="chat-header">
      <BackButton />
      <img class="image" :src="bar?.image_url" :alt="name" />
      <div class="name">{{ bar?.name }}</div>
    </div>
    <div class="messages-container" ref="messagesContainer">
      <div v-for="message in messages" :key="message.timestamp"
        :class="['message', { 'message-sent': message.userId === user._id }]">
        <div class="message-header">
          <span class="username">{{ message.userId === user._id ? 'moi' : message.username }}</span>
          <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
        </div>
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Écrivez votre message..." type="text" />
      <button @click="sendMessage">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
    <Status v-if="error" message="Vous devez être à moins de 100m d'un salon de discussion pour pouvoir vous y connecter" type="error" class="status-message" />
  </div>
  <ConnectionLanding v-else activeIcon="fa-solid fa-comments" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import ConnectionLanding from '../components/ConnectionLanding.vue';
import { isAuthenticated, user, token } from '../store/user';
import ChatService from '../services/WebSocketService';
import useLocationStore from '../store/locationStore';
import { useFetchApiCrud } from '../composables/useFetchApiCrud';
import BackButton from '../components/BackButton.vue';
import Status from '../components/Status.vue';

defineProps({
  id: {
    type: String,
    required: true,
  },
});


const route = useRoute();
const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);
const barCrud = useFetchApiCrud('bars', import.meta.env.VITE_API_URL);
const { coords, locationReady } = useLocationStore();
let wsService = null;
const bar = ref(null);
const error = ref(false);

const fetchBarInfo = async () => {
  try {
    const response = await barCrud.fetchApi({
      url: `bars/${route.params.id}`,
      method: 'GET',
    });
    bar.value = response;
  } catch (e) {
  }
};

const fetchMessages = async () => {
  try {
    const response = await barCrud.fetchApi({
      url: `bars/${route.params.id}/messages?lat=${coords.value.latitude}&lng=${coords.value.longitude}`,
      method: 'GET',
    });
    messages.value = response;
    scrollToBottom();
  } catch (error) {
    error.value = true;
  }
};



const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = () => {
  if (newMessage.value.trim() && wsService) {
    const message = {
      username: user.value?.username || 'Anonyme',
      userId: user.value?._id,
      content: newMessage.value.trim(),
      timestamp: Date.now(),
    };

    wsService.sendMessage(message);
    newMessage.value = '';
  }
};

const initializeWebSocket = () => {

  wsService = new ChatService(route.params.id, user.value?._id, token.value, coords.value);

  wsService.onMessage((data) => {

    const { userId, content, username, timestamp } = data;

    if (userId && content && username) {
      messages.value.push({
        userId,
        username,
        content,
        timestamp: timestamp || Date.now(),
      });
      scrollToBottom();
    }
  });

  wsService.onError((e) => {
    console.error('Erreur WebSocket :', e);
    error.value = true;
  });

  wsService.onClose(() => {
    error.value = true;
  });
};

onMounted(async () => {
  await fetchBarInfo();
  await fetchMessages();
  if (isAuthenticated.value) {
    watch(
      locationReady,
      (ready) => {
        if (ready && coords.value.latitude && coords.value.longitude) {
          initializeWebSocket();
        }
      },
      { immediate: true }
    );
  }
});

onUnmounted(() => {
  if (wsService) {
    wsService.disconnect();
  }
});
</script>


<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 5rem);
  background-color: var(--background-color);
}

.chat-header {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  gap: 1rem;
}

.image {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
}

.name {
  font-size: 1rem;
  font-weight: bold;
}

.messages-container {
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.message {
  max-width: 70%;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background-color: var(--text-color-light);
  align-self: flex-start;
}

.message-sent {
  background-color: var(--primary-color);
  opacity: 0.85;
  color: var(--text-color-light);
  align-self: flex-end;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
}

.username {
  font-weight: bold;
  padding-right: 1rem;
}

.timestamp {
  opacity: 0.7;
}

.chat-input {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  align-items: center;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--text-color);
  border-radius: 1.5rem;
  font-size: 1rem;
}

.chat-input input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.chat-input button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.chat-input button:hover {
  background-color: var(--accent-color);
}
</style>
