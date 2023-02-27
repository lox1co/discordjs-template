import { type ChatInputCommandInteraction, type InteractionResponse, SlashCommandBuilder } from "discord.js";

import type DiscordClient from "..";
import { type CommandOptions } from "../types";

const defaultOptions = { private: false };
export abstract class Command {
  constructor(
    private readonly _DiscordClient: DiscordClient,
    private readonly _data: (data: SlashCommandBuilder) => SlashCommandBuilder | any,
    private readonly _options: CommandOptions = defaultOptions
  ) {}

  public get name(): string {
    return this.data.name;
  }

  public get data(): any {
    return this._data(new SlashCommandBuilder());
  }

  public get client(): DiscordClient {
    return this._DiscordClient;
  }

  get options(): CommandOptions {
    return this._options;
  }

  abstract run(message: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> | InteractionResponse<boolean> | void;
}
