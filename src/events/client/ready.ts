import { ActivityType, REST, Routes, Events, version, type ActivityOptions } from "discord.js";

import type Client from "../../client";
import { BaseEvent } from "../../client";

export default class extends BaseEvent {
  constructor(client: Client) {
    super(client, {
      name: Events.ClientReady,
      once: true
    });
  }

  run(): void {
    console.info(`[Bot] Logged in as ${this.client.user?.tag}`);
    this.activity();
    this.postSlashCommands();
  }

  activity(): void {
    const guilds = this.client.guilds.cache;
    const memberCount = guilds.reduce((acc, guild) => acc + guild.memberCount, 0);
    const djsVersion = version.split(".")[0];

    const activities: ActivityOptions[] = [
      { name: `${guilds.size} Servers`, type: ActivityType.Listening },
      { name: `${this.client.channels.cache.size} Channels`, type: ActivityType.Playing },
      { name: `${memberCount} Users`, type: ActivityType.Watching },
      { name: `Discord.js v${djsVersion}`, type: ActivityType.Competing }
    ];
    let i = 0;
    setInterval(() => {
      if (i >= activities.length) i = 0;
      this.client.user?.setActivity(activities[i]);
      i++;
    }, 5e3);
  }

  async postSlashCommands(): Promise<void> {
    await new Promise(() => {
      const rest = new REST({ version: "10" }).setToken(String(process.env.TOKEN));
      try {
        console.log("[Commands] refreshing");
        const allCommands = this.client.commands.map((c) => c.data.toJSON());
        rest.put(Routes.applicationCommands(String(this.client.user?.id)), { body: allCommands });
        console.log("[Commands] reloaded");
      } catch (err) {
        console.error({ error: "error updating commands", description: (err as Error).stack });
      }
    });
  }
}
