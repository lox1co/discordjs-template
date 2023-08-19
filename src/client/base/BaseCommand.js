const { SlashCommandBuilder } = require("discord.js");

module.exports = class BaseCommand {
  constructor(_DiscordClient, _data) {
    this._DiscordClient = _DiscordClient;
    this._data = _data;
  }

  get name() {
    return this.data.name;
  }

  get data() {
    return this._data(new SlashCommandBuilder());
  }

  get client() {
    return this._DiscordClient;
  }
};
