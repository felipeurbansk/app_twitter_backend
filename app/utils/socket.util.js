const Ws = use("Ws");

function broadcast(channel, tweet) {
  const ch = Ws.getChannel(`room:${channel}`);

  if (!ch) console.log("[Util WSK] Canal não foi encontrado");

  const topic = ch.topic(`room:${channel}`);

  if (!topic) {
    console.error("[Utils WSK] Não existe um channel com esse nome", { topic });
    return;
  }

  console.log({ topic });

  topic.socket.broadcastToAll("message", tweet);
}

module.exports = {
  broadcast,
};
