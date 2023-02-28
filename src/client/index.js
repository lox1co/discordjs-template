const { Client: DiscordClient, Collection } = require("discord.js");

const { registryCommands, registryEvents } = require("./registry");
const { config } = require("./config");

const command = require("./base/Command");
const event = require("./base/Event");

module.exports = class Client extends DiscordClient {
  config = config;
  commands = new Collection();
  static Command = command;
  static Event = event;

  async start() {
    return await new Promise(() => {
      super.login(process.env.TOKEN);
      registryCommands(this);
      registryEvents(this);
    });
  }
};
