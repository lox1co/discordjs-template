import * as fs from "fs";
import * as path from "path";

import type Client from ".";
import { BaseCommand, BaseEvent } from ".";

const envDev = process.env.NODE_ENV !== "production";
const root = path.join(__dirname, "..");
const extension = envDev ? ".ts" : ".js";

export function getFiles(dir: string): string[] {
  const filePath = path.join(root, dir);
  return fs.readdirSync(filePath).flatMap((file) => {
    const stat = fs.lstatSync(path.join(filePath, file));
    if (stat.isDirectory()) return getFiles(path.join(dir, file));
    if (!file.endsWith(extension)) return [];
    return path.join(filePath, file);
  });
}

export async function registryCommands(client: Client): Promise<void> {
  const files = getFiles("commands");
  for (const file of files) {
    const { default: Command } = await import(file);
    if (Command.prototype instanceof BaseCommand) {
      const slash: BaseCommand = new Command(client);
      client.commands.set(slash.name, slash);
    }
  }
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
}
