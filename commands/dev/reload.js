const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Recharge une commande spécifique ou toutes les commandes.")
    .addStringOption((option) =>
      option
        .setName("commande")
        .setDescription("Nom de la commande à recharger")
        .setAutocomplete(true)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const commandName = interaction.options.getString("commande");

    try {
      const commandsPath = path.join(__dirname, "..", "..", "commands");

      if (commandName) {
        let found = false;

        for (const folder of fs.readdirSync(commandsPath)) {
          const filePath = path.join(commandsPath, folder, `${commandName}.js`);
          if (fs.existsSync(filePath)) {
            delete require.cache[require.resolve(filePath)];
            const newCommand = require(filePath);

            if (!newCommand.data || !newCommand.execute) {
              await interaction.editReply(
                `⚠️ La commande \`${commandName}\` est invalide.`
              );
              console.log(`⚠️ Commande invalide : ${commandName}`);
              return;
            }

            client.commands.set(newCommand.data.name, newCommand);
            await interaction.editReply(
              `✅ Commande \`${commandName}\` rechargée.`
            );
            console.log(`♻️ Commande rechargée : ${commandName}`);
            found = true;
            break;
          }
        }

        if (!found) {
          await interaction.editReply(
            `❌ La commande \`${commandName}\` n'existe pas.`
          );
          console.log(`❌ Commande non trouvée : ${commandName}`);
        }
      } else {
        const handler = require("../../handlers/handlersCommand");
        handler(client);

        await interaction.editReply(
          "🔄 Toutes les commandes ont été rechargées !"
        );
        console.log("♻️ Toutes les commandes rechargées !");
      }
    } catch (err) {
      console.error("❌ Erreur reload :", err);
      if (!interaction.replied) {
        await interaction.editReply(
          "❌ Une erreur est survenue lors du reload."
        );
      } else {
        await interaction.followUp({
          content: "❌ Une erreur est survenue.",
          ephemeral: true,
        });
      }
    }
  },
};
