const { Events } = require("discord.js");
const { Event } = require("../../client");

module.exports = class InteractionCreateEvent extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate
    });
  }

  async run(interaction) {
    if (!interaction.isChatInputCommand()) return;

    interaction.guild.config = this.client.config.default;

    const command = this.client.commands.get(interaction.commandName);

    if (command === undefined) return;

    try {
      command.run(interaction);
    } catch (err) {
      console.error({ error: "[Error in command]", description: err.stack });
    }
  }
};
