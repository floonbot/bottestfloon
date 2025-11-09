const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.interactions = {
    buttons: new Map(),
    selects: new Map(),
    modals: new Map(),
    autocompletes: new Map(),
  };

  const basePath = path.join(__dirname, "../interactions");
  const types = ["buttons", "selects", "modals", "autocompletes"];

  for (const type of types) {
    const folder = path.join(basePath, type);
    if (!fs.existsSync(folder)) continue;

    const files = fs.readdirSync(folder).filter((f) => f.endsWith(".js"));
    for (const file of files) {
      const filePath = path.join(folder, file);
      const interaction = require(filePath);

      if (!interaction.customId && type !== "autocompletes") {
        console.warn(
          `⚠️ ${type.toUpperCase()} ignoré (pas de customId) : ${file}`
        );
        continue;
      }

      if (type === "autocompletes") {
        client.interactions.autocompletes.set(interaction.name, interaction);
      } else {
        client.interactions[type].set(interaction.customId, interaction);
      }

      console.log(`✅ Interaction ${type} chargée : ${file}`);
    }
  }
};
