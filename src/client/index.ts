import { Client as DiscordClient, Collection } from "discord.js";

import { registryCommands, registryEvents } from "./registry";
import { config } from "./config";
import { type BaseCommand } from "./base/BaseCommand";

export * from "./base/BaseCommand";
export * from "./base/BaseEvent";

export default class Client extends DiscordClient {
  config = config;
  public commands = new Collection<string, BaseCommand>();

  public async start(): Promise<unknown> {
    return await new Promise(() => {
      super.login(process.env.TOKEN);
      registryCommands(this);
      registryEvents(this);
    });
  }
}
