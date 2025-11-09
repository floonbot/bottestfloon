module.exports = {
  name: "reload",
  async execute(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const choices = [...client.commands.keys()];
    const filtered = choices.filter((c) => c.startsWith(focusedValue));
    await interaction.respond(filtered.map((c) => ({ name: c, value: c })));
  },
};
