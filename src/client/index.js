const { Client: DiscordClient, Collection } = require("discord.js");

const { registryCommands, registryEvents } = require("./registry");
const { config } = require("./config");

const command = require("./base/BaseCommand");
const event = require("./base/BaseEvent");

module.exports = class Client extends DiscordClient {
  config = config;
  commands = new Collection();
  static BaseCommand = command;
  static BaseEvent = event;

  async start() {
    return await new Promise(() => {
      super.login(process.env.TOKEN);
      registryCommands(this);
      registryEvents(this);
    });
  }
};
