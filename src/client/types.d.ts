/* eslint-disable @typescript-eslint/member-delimiter-style */
import {
  type Events,
  type Message as DjsMessage,
  type ChatInputCommandInteraction as DjsChatInputCommandInteraction,
  type ButtonInteraction as DjsButtonInteraction,
  type PermissionResolvable
} from "discord.js";
export interface BaseEventOptions {
  name: Events;
  once?: boolean;
}
export interface CommandOptions {
  private?: boolean;
}
export interface ClientConfig {
  owners: string[];
  default: Config;
}
export interface Config {
  value: string;
}
export interface Guild {
  config: Config;
}
export interface BaseEvent {
  guild: Guild;
}

export type permissionsCommand = { user: PermissionResolvable[] | null; bot: PermissionResolvable[] | null } | null;
export type Message = DjsMessage & BaseEvent;
export type ChatInputCommandInteraction = DjsChatInputCommandInteraction & BaseEvent;
export type ButtonInteraction = DjsButtonInteraction & BaseEvent;
