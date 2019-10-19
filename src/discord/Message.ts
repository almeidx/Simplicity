/* eslint-disable no-underscore-dangle */
import {
  Structures, StringResolvable, APIMessage, MessageOptions, MessageEditOptions,
} from 'discord.js';
import SimplicityClient from 'src/bot/client/SimplicityClient';

type contentType = StringResolvable | APIMessage
type optionsType = MessageEditOptions | MessageOptions

export default Structures.extend('Message', (DiscordMessage) => {
  class SimplicityMessage extends DiscordMessage {
    public readonly client: SimplicityClient

    private _args: string[]

    private _prefix: string

    private _commandName: string

    async send(content: contentType, options: optionsType) {
      const msgId = this.client.commandMessages.get(this.id);
      const message = msgId && await this.channel.messages.fetch(msgId);
      if (message) {
        return message.edit(content, options);
      }
      return this.channel.send(content, options);
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

    get language() {
      return this.guild ? this.guild.language : this.client.defaultLanguage;
    }

    get query() {
      return this.args.join(' ');
    }

    get args() {
      if (this._args) return this._args;
      this._args = this.content.slice(this.prefix.length).split(' ');
      return this._args;
    }

    get prefix() {
      return this._prefix;
    }

    set prefix(prefix) {
      this._prefix = prefix;
    }

    get mentioned() {
      const MentionRegex = new RegExp(`^(<@!?${this.client.user.id}>)`);
      return MentionRegex.test(this.content);
    }

    get commandName() {
      if (this._commandName) return this._commandName;
      return this.args.shift();
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
    commandName: string;
    send(content: contentType, options?: optionsType): Promise<Message | any>;
  }
}
