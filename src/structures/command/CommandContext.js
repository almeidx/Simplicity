'use strict';

const EmojiUtl = require('@util/EmojiUtil');
const i18next = require('i18next');

class CommandContext {
  constructor(options) {
    this.totalLength = options.totalLength;

    this.message = options.message;
    this.mentions = this.message.mentions;
    this.member = this.message.member;
    this.guild = this.message.guild;
    this.author = this.message.author;
    this.channel = this.message.channel;
    this.client = this.message.client;
    this.voiceChannel = this.member.voice && this.member.voice.channel;

    this.prefix = options.prefix;
    this.command = options.command;
    this.botLanguages = Object.keys(i18next.store.data);
    this.language = this.botLanguages.includes(options.language) ?
      options.language :
      this.message.language || process.env.DEFAULT_LANG;
    this.query = options.query;
    this.args = options.args;
    this.t = i18next.getFixedT(this.language);

    this.emoji = this._emoji.bind(this);
    this.send = this.channel.send.bind(this.channel);
    this.message.language = this.language;

    this.canEmbed = this.guild ? this.channel.permissionsFor(this.guild.me).has('EMBED_LINKS') : true;

    // Database
    this.database = this.client.database;
    this.guildData = options.guildData;
    this.flags = {};
  }

  _emoji(...emojis) {
    if (typeof emojis[emojis.length - 1] === 'object') {
      emojis[emojis.length - 1].textChannel = this.channel;
    } else {
      emojis.push({ textChannel: this.channel });
    }

    return EmojiUtl.getEmoji(...emojis);
  }
}

module.exports = CommandContext;
