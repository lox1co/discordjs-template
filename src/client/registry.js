const fs = require("fs");
const path = require("path");

const root = path.join(process.cwd(), "src");

function getFiles(dir) {
  const filePath = path.join(root, dir);
  return fs.readdirSync(filePath).flatMap((file) => {
    const stat = fs.lstatSync(path.join(filePath, file));
    if (stat.isDirectory()) return getFiles(path.join(dir, file));
    if (!file.endsWith(".js")) return [];
    return path.join(filePath, file);
  });
}

function registryCommands(client) {
  const files = getFiles("commands");
  for (const file of files) {
    const Command = require(path.join(file));
    const command = new Command(client);
    client.commands.set(command.name, command);
  }

  if (client.commands.size === 0) console.info("[Commands (/)] - 0");
  else console.log("[Commands] Loaded");
}

function registryEvents(client) {
  const files = getFiles("events");
  for (const file of files) {
    const Event = require(file);
    const event = new Event(client);
    const onOrOnce = event.once ? "once" : "on";
    client[onOrOnce](event.name, (...args) => event.run(...args));
  }

  console.log("[Events] Loaded");
}

module.exports = { registryCommands, registryEvents };
