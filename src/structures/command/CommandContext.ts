import i18next, { TFunction } from 'i18next';
import {
  Message, TextChannel, VoiceChannel,
} from 'discord.js';
import Config from '../../config';
import { EmojiUtil, Emojis } from '../../util';
import SimplicityClient from '../discord/SimplicityClient';

import { GuildDoc } from '../../database/models/Guild.interfaces';

export interface CommandContextOptions {
  message: Message;
  args: string[];
  prefix: string;
  language?: string;
  t: TFunction;
  guildData: GuildDoc
}

export default class CommandContext {
  message: Message;
  // mentions: MessageMentions;
  // member: GuildMember | null;
  // author: User;
  // guild: Guild;
  channel: TextChannel;
  // client: SimplicityClient;
  voiceChannel?: VoiceChannel | null;
  prefix: string;
  language: string;
  args: string[];
  t: TFunction;
  // send: TextChannel['send'];
  // canEmbed: boolean;
  database: SimplicityClient['database']
  guildData: GuildDoc;
  flags: Record<string, any>;
  emoji: this['getEmoji'];

  constructor(opts: CommandContextOptions) {
    // this.command = opts.command;
    this.args = opts.args;
    this.prefix = opts.prefix;
    this.t = opts.t;
    this.language = opts.language || Config.LANGUAGE;
    this.message = opts.message;
    this.t = i18next.getFixedT(this.language);
    this.emoji = this.getEmoji.bind(this);
    this.guildData = opts.guildData;
    this.flags = {};

    // this.mentions = this.message.mentions;
    // this.member = this.message.member;
    // this.guild = this.message.guild as Guild;
    // this.author = this.message.author;
    this.channel = this.message.channel as TextChannel;
    // this.client = this.message.client as SimplicityClient;
    // this.database = this.client.database;
    // this.voiceChannel = this.member?.voice.channel;
    // this.send = this.channel.send.bind(this.channel);
    // this.canEmbed = this.channel
    // .permissionsFor(String(this.guild.me?.id))?.has('EMBED_LINKS') ?? true;
  }

  getEmoji(id: boolean, ...emojis: Emojis[]): string {
    return EmojiUtil.getEmoji({ id, channel: this.channel }, ...emojis);
  }
}
