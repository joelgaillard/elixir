<template>
  <div class="q-pa-md row justify-center"> 
    <div style="width: 100%; max-width: 400px">
      <q-chat-message
      v-for="(message, index) in messages"
        :key="index"
        :name="message.name"
        :text="message.text"
        :sent="message.sent"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatMessage',
  data() {
    return {
      messages: [
        { name: 'Moi', text: ['hey, tu bois quoi ?'], sent: true },
        { name: 'Marianne', text: ['un Bloody mary, et toi ?'] }
      ]
    };
  }
};
</script>

<style scoped>
.q-pa-md {
  padding: 16px;
}
.row {
  display: flex;
  flex-direction: row;
}
.justify-center {
  justify-content: center;
}

</style>