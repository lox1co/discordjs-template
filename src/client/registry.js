const fs = require("fs");
const path = require("path");

const filter = (file) => file.endsWith(".js");
const root = path.join(process.cwd(), "src");

function registryCommands(client) {
  const folders = fs.readdirSync(path.join(root, "commands"));
  for (const folder of folders) {
    const files = fs.readdirSync(path.join(root, "commands", folder)).filter(filter);
    for (const file of files) {
      const Command = require(path.join(root, "commands", folder, file));
      const command = new Command(client);
      client.commands.set(command.name, command);
    }
  }

  if (client.commands.size === 0) {
    console.info("[Commands (/)] - 0");
    return;
  }
  console.log("[Commands] Loaded");
}

function registryEvents(client) {
  const folders = fs.readdirSync(path.join(root, "events"));
  for (const folder of folders) {
    const files = fs.readdirSync(path.join(root, "events", folder)).filter(filter);
    for (const file of files) {
      const Event = require(path.join(root, "events", folder, file));
      const event = new Event(client);
      client[event.once ? "once" : "on"](event.name, (...args) => event.run(...args));
    }
  }
  console.log("[Events] Loaded");
}

module.exports = { registryCommands, registryEvents };
