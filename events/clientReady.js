module.exports = {
  name: "clientReady",
  once: true,
  execute(client) {
    console.log(`🚀 Bot connecté : ${client.user.tag}`);
  },
};
