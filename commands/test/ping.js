const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Répond avec Pong!")
    .setDefaultMemberPermissions(null)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.reply("🏓 Pongs");
  },
};
