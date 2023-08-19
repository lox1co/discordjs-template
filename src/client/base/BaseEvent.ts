import type DiscordClient from "..";

import { type BaseEventOptions } from "../types";

export abstract class BaseEvent {
  constructor(private readonly _DiscordClient: DiscordClient, private readonly _options: BaseEventOptions) {}

  public get name(): string {
    return this._options.name;
  }

  public get once(): boolean {
    return this._options.once ?? false;
  }

  public get client(): DiscordClient {
    return this._DiscordClient;
  }
  abstract run(...args: any[]): any | Promise<any>;
}
