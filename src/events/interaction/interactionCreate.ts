import { Events } from "discord.js";
import { type Client, BaseEvent } from "../../core";
import { type ChatInputCommandInteraction } from "../../core/types";

export default class extends BaseEvent {
  constructor(client: Client) {
    super(client, {
      name: Events.InteractionCreate
    });
  }

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.commands.get(interaction.commandName);
    if (command === undefined) return;

    try {
      command.run(interaction);
    } catch (err) {
      console.error({ error: "[Error in command]", description: (err as Error).stack });
    }
  }
}
