import * as fs from "node:fs";
import * as path from "node:path";

import { type Client, BaseCommand, BaseEvent } from ".";

const envDev = process.env.NODE_ENV !== "production";
const root = path.join(__dirname, "..");
const extension = envDev ? ".ts" : ".js";

function getFilesPaths(dir: string): string[] {
  const dirPath = path.join(root, dir);
  return fs.readdirSync(dirPath).flatMap((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) return getFilesPaths(path.join(dir, file));
    if (file.endsWith(extension)) return [fullPath];
    return [];
  });
}

async function importModule(filePath: string): Promise<null | any> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete require.cache[require.resolve(filePath)];

    return await import(filePath);
  } catch (error) {
    console.error(`Failed to import module at ${filePath}:`, error);
    return null;
  }
}

async function registerCommand(client: Client, filePath: string): Promise<void> {
  const module = await importModule(filePath);
  if (module === null) return;

  const { default: Command } = module;
  if (Command.prototype instanceof BaseCommand) {
    const commandInstance: BaseCommand = new Command(client);
    client.commands.set(commandInstance.name, commandInstance);
  }
}

async function registerEvent(client: Client, filePath: string): Promise<void> {
  const module = await importModule(filePath);
  if (module === null) return;

  const { default: Event } = module;
  if (Event.prototype instanceof BaseEvent) {
    const eventInstance: BaseEvent = new Event(client);
    const method = eventInstance.once ? "once" : "on";
    client[method](eventInstance.name, (...args) => eventInstance.run(...args));
  }
}

export async function registerCommands(client: Client): Promise<void> {
  client.commands.clear();

  const commandFiles = getFilesPaths("commands");
  await Promise.all(
    commandFiles.map(async (file) => {
      await registerCommand(client, file);
    })
  );
}
export async function registerEvents(client: Client): Promise<void> {
  client.removeAllListeners();

  const eventFiles = getFilesPaths("events");
  await Promise.all(
    eventFiles.map(async (file) => {
      await registerEvent(client, file);
    })
  );
}
