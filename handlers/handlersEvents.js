const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const eventsPath = path.join(__dirname, "../events");

  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (!event.name || typeof event.execute !== "function") {
      console.warn(
        `⚠️  Fichier événement ignoré : ${file} (propriétés manquantes)`
      );
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    console.log(`✅ Événement chargé : ${event.name}`);
  }
};
