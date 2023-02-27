import { Events } from "discord.js";

import type Client from "../../client";
import { Event } from "../../client";

import { type ChatInputCommandInteraction } from "../../client/types";

export default class InteractionCreateEvent extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.InteractionCreate
    });
  }

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    interaction.guild.config = this.client.config.default;

    const command = this.client.commands.get(interaction.commandName);

    if (command === undefined) return;

    try {
      command.run(interaction);
    } catch (err) {
      console.error({ error: "[Error in command]", description: (err as Error).stack });
    }
  }
}
