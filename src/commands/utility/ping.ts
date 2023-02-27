import { type InteractionResponse } from "discord.js";

import type Client from "../../client";
import { Command } from "../../client";
import { type ChatInputCommandInteraction } from "../../client/types";

export default class PingCommand extends Command {
  constructor(client: Client) {
    super(client, (data) => data.setName("ping").setDescription("Ping command"));
  }

  async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean>> {
    return await interaction.reply({ content: "ping command" });
  }
}
