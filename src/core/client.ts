import { Client as DiscordClient, Collection } from "discord.js";
import { type BaseCommand, registerCommands, registerEvents } from ".";
import { i18n } from "./language";

export class Client extends DiscordClient {
  public commands = new Collection<string, BaseCommand>();
  public i18n = i18n;
  public lng = "es";

  public async start(): Promise<void> {
    try {
      await this.login(process.env.TOKEN);
      await registerCommands(this);
      await registerEvents(this);
    } catch (error) {
      console.error("Failed to login or register commands/events:", error);
    }
  }

  setLang(lang: string): void {
    this.lng = lang;
  }
}
