import { type ChatInputCommandInteraction, type InteractionResponse, SlashCommandBuilder } from "discord.js";
import { type Client } from "..";
import { type CommandOptions } from "../types";

const defaultOptions = { private: false };

export abstract class BaseCommand {
  constructor(
    private readonly _client: Client,
    private readonly _data: (data: SlashCommandBuilder) => SlashCommandBuilder | any,
    private readonly _options: CommandOptions = defaultOptions
  ) {}

  public get name(): string {
    return this.data.name;
  }

  public get data(): SlashCommandBuilder {
    return this._data(new SlashCommandBuilder());
  }

  public get client(): Client {
    return this._client;
  }

  public translate(key: string, options?: any): string {
    const makedOptions = Object.assign({ lng: this.client.lng }, options);
    return this.client.i18n.t(key, makedOptions) as string;
  }

  get options(): CommandOptions {
    return this._options;
  }

  abstract run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> | InteractionResponse<boolean> | void;
}
