import { type ActivityOptions, ActivityType, Events, version } from "discord.js";
import { type Client, BaseEvent } from "../../core";

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
}
