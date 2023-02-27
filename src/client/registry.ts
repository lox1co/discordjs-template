import * as fs from "fs";
import * as path from "path";

import type Client from ".";
import { Command as BaseCommand, Event as BaseEvent } from ".";

const envDev = process.env.NODE_ENV === "develompent";
const filter = (file: string): boolean => file.endsWith(envDev ? ".ts" : ".js");
const root = path.join(process.cwd(), envDev ? "src" : "dist");

export async function registryCommands(client: Client): Promise<void> {
  const folders = fs.readdirSync(path.join(root, "commands"));
  for (const folder of folders) {
    const files = fs.readdirSync(path.join(root, "commands", folder)).filter(filter);
    for (const file of files) {
      const { default: Slash } = await import(path.join(root, "commands", folder, file));
      if (Slash.prototype instanceof BaseCommand) {
        const slash: BaseCommand = new Slash(client);
        client.commands.set(slash.name, slash);
      }
    }
  }

  if (client.commands.size === 0) {
    console.info("[Commands (/)] - 0");
    return;
  }
  console.log("[Commands] Loaded");
}

export async function registryEvents(client: Client): Promise<void> {
  const folders = fs.readdirSync(path.join(root, "events"));
  for (const folder of folders) {
    const files = fs.readdirSync(path.join(root, "events", folder)).filter(filter);
    for (const file of files) {
      const { default: Event } = await import(path.join(root, "events", folder, file));
      if (Event.prototype instanceof BaseEvent) {
        const event: BaseEvent = new Event(client);
        client[event.once ? "once" : "on"](event.name, (...args) => event.run(...args));
      }
    }
  }
  console.log("[Events] Loaded");
}
