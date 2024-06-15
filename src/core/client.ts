import { Client as DiscordClient, Collection } from "discord.js";

import { type BaseCommand, registerCommands, registerEvents } from ".";

export class Client extends DiscordClient {
  public commands = new Collection<string, BaseCommand>();

  public async start(): Promise<void> {
    try {
      await super.login(process.env.TOKEN);
      await Promise.all([registerCommands(this), registerEvents(this)]);
    } catch (error) {
      console.error("Failed to login or register commands/events:", error);
    }
  }
}
