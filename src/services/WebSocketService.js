class ChatService {
  constructor(barId, userid, token, coords) {
    const wsUrl = `ws://elixir-api-st9s.onrender.com:3000?barId=${barId}&userId=${userid}&token=${token}&lat=${coords.latitude}&lng=${coords.longitude}`;
    console.log('WebSocket URL:', wsUrl); // Log pour vérifier l'URL
    this.ws = new WebSocket(wsUrl);
    this.connected = false;

    this.ws.onopen = () => {
      this.connected = true;
      console.log('Connecté au chat');
    };

    this.ws.onmessage = (event) => {
      console.log('Message reçu:', event.data);
      try {
        const data = JSON.parse(event.data);
    
        if (data.error) {
          console.error('Erreur serveur:', data.error);
          return;
        }
    
        if (data.data && typeof data.data === 'object') {
          console.log('Données reçues:', data.data);
          const { userId, content, username, timestamp } = data.data;
    
          if (this.messageCallback) {
            this.messageCallback({ userId, username, content, timestamp });
          }
        } else {
          console.error('Données mal formatées :', data);
        }
      } catch (error) {
        console.error('Erreur de parsing:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
      if (this.errorCallback) {
        this.errorCallback(error);
      }
    };

    this.ws.onclose = () => {
      console.log('Connexion WebSocket fermée');
      if (this.closeCallback) {
        this.closeCallback();
      }
    };
  }

  sendMessage(messageData) {
    if (this.ws.readyState === WebSocket.OPEN) {
      console.log('Envoi du message:', messageData); // Log pour vérifier les messages envoyés
      this.ws.send(JSON.stringify({
        username: messageData.username,
        content: messageData.content
      }));
    } else {
      console.error('WebSocket non connecté');
    }
  }

  onMessage(callback) {
    this.messageCallback = callback;
  }

  onError(callback) {
    this.errorCallback = callback;
  }

  onClose(callback) {
    this.closeCallback = callback;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default ChatService;