import { REST, Routes } from "discord.js";
import { type Client } from ".";

export async function postSlashCommands(client: Client): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(String(process.env.TOKEN));
  try {
    console.log("[Commands] refreshing");
    const allCommands = client.commands.map((command) => command.data.toJSON());
    await rest.put(Routes.applicationCommands(String(client.user?.id)), { body: allCommands });
    console.log("[Commands] reloaded");
  } catch (err) {
    console.error({ error: "error updating commands", description: (err as Error).stack });
  }
}
