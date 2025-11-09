module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction, client);
      } else if (interaction.isButton()) {
        const button = client.interactions?.buttons?.get(interaction.customId);
        if (button) return button.execute(interaction, client);
      } else if (interaction.isStringSelectMenu()) {
        const menu = client.interactions?.selects?.get(interaction.customId);
        if (menu) return menu.execute(interaction, client);
      } else if (interaction.isModalSubmit()) {
        const modal = client.interactions?.modals?.get(interaction.customId);
        if (modal) return modal.execute(interaction, client);
      } else if (interaction.isAutocomplete()) {
        const auto = client.interactions?.autocompletes?.get(
          interaction.commandName
        );
        if (auto) return auto.execute(interaction, client);
      }
    } catch (err) {
      console.error("❌ Erreur interactionCreate :", err);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "Erreur interne 😔",
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: "Erreur interne 😔",
          ephemeral: true,
        });
      }
    }
  },
};
