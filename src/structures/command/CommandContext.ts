import i18next, { TFunction } from 'i18next';
import {
  Message, MessageMentions, TextChannel, VoiceChannel, User, Guild, GuildMember,
} from 'discord.js';
import Config from '../../config';
import { EmojiUtil, Emojis } from '../../util';
import SimplicityClient from '../discord/SimplicityClient';

import { GuildDoc } from '../../database/models/Guild.interfaces';
import Command from './Command';

export interface CommandContextOptions {
  message: Message;
  args: string[];
  prefix: string;
  language?: string;
  t: TFunction;
  guildData?: GuildDoc
  command: Command;
}

export default class CommandContext {
  message: Message;
  command: Command;
  mentions: MessageMentions;
  member: GuildMember;
  author: User;
  guild: Guild;
  channel: TextChannel;
  client: SimplicityClient;
  voiceChannel?: VoiceChannel | null;
  prefix: string;
  language: string;
  args: string[];
  t: TFunction;
  database: SimplicityClient['database']
  guildData?: GuildDoc;
  flags: Record<string, any>;
  emoji: this['getEmoji'];
  send: this['sendMessage'];

  /**
   * @param opts The options for this command context
   */
  constructor(opts: CommandContextOptions) {
    this.command = opts.command;
    this.args = opts.args;
    this.prefix = opts.prefix;
    this.t = opts.t;
    this.language = opts.language || Config.LANGUAGE;
    this.message = opts.message;
    this.t = i18next.getFixedT(this.language);
    this.emoji = this.getEmoji.bind(this);
    this.send = this.sendMessage.bind(this);
    this.guildData = opts.guildData;
    this.flags = {};

    this.mentions = this.message.mentions;
    this.member = this.message.member as GuildMember;
    this.guild = this.message.guild as Guild;
    this.author = this.message.author;
    this.channel = this.message.channel as TextChannel;
    this.client = this.message.client as SimplicityClient;
    this.database = this.client.database;
    this.voiceChannel = this.member?.voice.channel;
  }

  getEmoji(id: boolean, ...emojis: Emojis[]): string {
    return EmojiUtil.getEmoji({ id, channel: this.channel }, ...emojis);
  }

  async sendMessage(...args: Parameters<TextChannel['send']>): Promise<Message> {
    const message = this.client.commandMessages.get(this.message.id);
    if (message) {
      return message.edit(...args as Parameters<Message['edit']>);
    }
    const sent = await this.channel.send(...args);
    this.client.commandMessages.set(this.message.id, sent);
    this.client.setTimeout(() => this.client.commandMessages.delete(this.message.id), 3.6e+6);
    return sent;
  }
}
