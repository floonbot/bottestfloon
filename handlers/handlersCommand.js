const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

/**
 *
 * @param {import('discord.js').Client} client
 */
module.exports = (client) => {
  const commandsPath = path.join(__dirname, "../commands");
  client.commands = new Collection();

  const loadCommands = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dir, file.name);

      if (file.isDirectory()) {
        loadCommands(filePath);
      } else if (file.name.endsWith(".js")) {
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
          console.log(`✅ Commande chargée : ${command.data.name}`);
        } else {
          console.warn(
            `⚠️  Commande ignorée : ${filePath} (propriétés manquantes)`
          );
        }
      }
    }
  };

  loadCommands(commandsPath);
};
