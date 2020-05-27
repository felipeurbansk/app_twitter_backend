"use strict";

class TweetGlobalController {
  constructor({ socket, request }) {
    console.log("[Controller WSK] Nova inscrição no cannal ", socket.topic);
    this.socket = socket;
    this.request = request;
  }

  onMessage(tweet) {
    this.socket.broadcastToAll("message", { tweet });
  }

  onClose() {
    console.log(
      "[Controller WSK]  Fechado a conexão com o canal ",
      this.socket.topic
    );
  }
}

module.exports = TweetGlobalController;
