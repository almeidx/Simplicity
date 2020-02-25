'use strict';

const { EMOJIS, EMOJIS_CUSTOM } = require('@util/Constants');
const i18next = require('i18next');
const getCustomEmoji = (id) => EMOJIS_CUSTOM && EMOJIS_CUSTOM[id];
const getDefaultEmoji = (name) => EMOJIS && EMOJIS[name];

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

    // database
    this.database = this.client.database;
    this.guildData = options.guildData;
    this.flags = {};
  }

  _emoji(name = 'QUESTION', options) {
    const { id, other } = Object.assign({ id: false, other: null }, options);
    name = name.toUpperCase();

    const custom = getCustomEmoji(name) || (other && getCustomEmoji(other));
    const normal = getDefaultEmoji(name) || (other && getDefaultEmoji(other));

    if (this.guild && this.channel.permissionsFor(this.guild.me).has('USE_EXTERNAL_EMOJIS') && custom) {
      const emoji = this.client.emojis.cache.get(custom);
      if (emoji) return id ? emoji.id : emoji.toString();
    }
    return normal || false;
  }
}

module.exports = CommandContext;
