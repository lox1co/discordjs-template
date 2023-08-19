const { BaseCommand } = require("../../client");

module.exports = class extends BaseCommand {
  constructor(client) {
    super(client, (data) => data.setName("ping").setDescription("Ping command"));
  }

  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  async run(interaction) {
    return await interaction.reply({ content: "ping command" });
  }
};
