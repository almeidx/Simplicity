/* eslint-disable no-underscore-dangle */
import {
  Structures, StringResolvable, APIMessage, MessageOptions, MessageEditOptions,
} from 'discord.js';
import SimplicityClient from 'src/bot/client/SimplicityClient';
import i18n from 'i18next';
import Command from '../bot/commands/base/Command';

type contentType = StringResolvable | APIMessage
type optionsType = MessageEditOptions | MessageOptions

export default Structures.extend('Message', (DiscordMessage) => {
  class SimplicityMessage extends DiscordMessage {
    public readonly client: SimplicityClient

    async send(content: contentType, options: optionsType) {
      const msgId = this.client.commandMessages.get(this.id);
      const message = msgId && await this.channel.messages.fetch(msgId);

      if (message) {
        return message.edit(content, options);
      }
      const res = await this.channel.send(content, options);
      this.client.commandMessages.set(this.id, res.id);
      return res;
    }

    get botLanguages() {
      return this.client.languages;
    }

    get voiceChannel() {
      return this.member && this.member.voice && this.member.voice.channel;
    }

    get guildPrefix() {
      return this.guild ? this.guild.prefix : process.env.PREFIX;
    }

    get mentioned() {
      const MentionRegex = new RegExp(`^(<@!?${this.client.user.id}>)`);
      return MentionRegex.test(this.content);
    }

    get query() {
      return this.args.join(' ');
    }
  }

  return SimplicityMessage;
});

declare module 'discord.js' {
  interface Message {
    client: SimplicityClient;
    voiceChannel: VoiceChannel;
    prefix: string;
    botLanguages: string[];
    language: string;
    query: string;
    guildPrefix: string;
    mentioned: boolean;
    args: string[];
    command: Command;
    _: i18n.TFunction;
    send(content: contentType, options?: optionsType): Promise<Message | any>;
  }
}
