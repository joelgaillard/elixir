class ChatService {
  constructor(barId, userid, token, coords) {
    const wsUrl = `wss://elixir-api-st9s.onrender.com?barId=${barId}&userId=${userid}&token=${token}&lat=${coords.latitude}&lng=${coords.longitude}`;
    this.ws = new WebSocket(wsUrl);
    this.connected = false;

    this.ws.onopen = () => {
      this.connected = true;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.error) {
          return;
        }

        if (data.data && typeof data.data === "object") {
          const { userId, content, username, timestamp } = data.data;

          if (this.messageCallback) {
            this.messageCallback({ userId, username, content, timestamp });
          }
        } else {
        }
      } catch (error) {}
    };

    this.ws.onerror = (error) => {
      console.error("Erreur WebSocket:", error);
      if (this.errorCallback) {
        this.errorCallback(error);
      }
    };

    this.ws.onclose = () => {
      console.log("Connexion WebSocket fermée");
      if (this.closeCallback) {
        this.closeCallback();
      }
    };
  }

  sendMessage(messageData) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          username: messageData.username,
          content: messageData.content,
        })
      );
    } else {
      console.error("WebSocket non connecté");
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
