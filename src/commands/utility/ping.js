const { Command } = require("../../client");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, (data) => data.setName("ping").setDescription("Ping command"));
  }

  async run(interaction) {
    return await interaction.reply({ content: "ping command" });
  }
};
