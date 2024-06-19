import { type InteractionResponse } from "discord.js";
import { type Client, BaseCommand } from "../../core";
import { type ChatInputCommandInteraction } from "../../core/types";

export default class extends BaseCommand {
  constructor(client: Client) {
    super(client, (data) => data.setName("ping").setDescription("Ping command"));
  }

  async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean>> {
    const botLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = this.client.ws.ping;

    return await interaction.reply({ content: this.translate("ping", { botLatency, apiLatency }) });
  }
}
