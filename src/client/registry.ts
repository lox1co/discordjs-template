import * as fs from "fs";
import * as path from "path";

import type Client from ".";
import { Command as BaseCommand, Event as BaseEvent } from ".";

const envDev = process.env.NODE_ENV === "develompent";
const root = path.join(process.cwd(), envDev ? "src" : "dist");

function getFiles(dir: string): string[] {
  const filePath = path.join(root, dir);
  return fs.readdirSync(filePath).flatMap((file) => {
    const stat = fs.lstatSync(path.join(filePath, file));
    if (stat.isDirectory()) return getFiles(path.join(dir, file));
    if (!file.endsWith(envDev ? ".ts" : ".js")) return [];
    return path.join(filePath, file);
  });
}

export async function registryCommands(client: Client): Promise<void> {
  const files = getFiles("commands");
  for (const file of files) {
    const { default: Slash } = await import(file);
    if (Slash.prototype instanceof BaseCommand) {
      const slash: BaseCommand = new Slash(client);
      client.commands.set(slash.name, slash);
    }
  }

  if (client.commands.size === 0) console.info("[Commands (/)] - 0");
  else console.log("[Commands] Loaded");
}

export async function registryEvents(client: Client): Promise<void> {
  const files = getFiles("events");
  for (const file of files) {
    const { default: Event } = await import(file);
    if (Event.prototype instanceof BaseEvent) {
      const event: BaseEvent = new Event(client);
      const onOrOnce = event.once ? "once" : "on";
      client[onOrOnce](event.name, (...args) => event.run(...args));
    }
  }
  console.log("[Events] Loaded");
}
