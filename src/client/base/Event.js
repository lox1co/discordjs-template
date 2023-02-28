module.exports = class Event {
  constructor(_DiscordClient, _options) {
    this._DiscordClient = _DiscordClient;
    this._options = _options;
  }

  get name() {
    return this._options.name;
  }

  get once() {
    return this._options.once ?? false;
  }

  get client() {
    return this._DiscordClient;
  }
};
