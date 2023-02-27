import { Client as DiscordClient, Collection } from "discord.js";

import { registryCommands, registryEvents } from "./registry";
import { config } from "./config";
import { type Command } from "./base/Command";

export * from "./base/Command";
export * from "./base/Event";

export default class Client extends DiscordClient {
  config = config;
  public commands = new Collection<string, Command>();

  public async start(): Promise<unknown> {
    return await new Promise(() => {
      super.login(process.env.TOKEN);
      registryCommands(this);
      registryEvents(this);
    });
  }
}
