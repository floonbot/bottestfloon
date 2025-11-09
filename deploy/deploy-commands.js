const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const commands = [];
const foldersPath = path.join(__dirname, "../commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(
        `[AVERTISSEMENT] Commande ${file} ignorée : données manquantes`
      );
    }
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN_DISCORD);

(async () => {
  try {
    console.log(`🔁 Déploiement de ${commands.length} commandes...`);
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log(`✅ ${data.length} commandes enregistrées avec succès !`);
  } catch (error) {
    console.error(error);
  }
})();
