import { config } from "dotenv";
import { GatewayIntentBits, Partials } from "discord.js";
import { Client } from "./core";

config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

client.start();
