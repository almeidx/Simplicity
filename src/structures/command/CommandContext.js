'use strict';

const Constants = require('../../utils/Constants');
const SimplicityEmbed = require('../discord/SimplicityEmbed');
const TextUtils = require('../../utils/TextUtils');
const { MessageAttachment } = require('discord.js');

const getCustomEmoji = (id) => Constants.EMOJIS_CUSTOM && Constants.EMOJIS_CUSTOM[id];
const getDefaultEmoji = (name) => Constants.EMOJIS && Constants.EMOJIS[name];

class CommandContext {
  constructor(options) {
    this.totalLength = options.totalLength;

    this.message = options.message;
    this.mentions = options.message.mentions;
    this.member = options.message.member;
    this.guild = options.message.guild;
    this.author = options.message.author;
    this.channel = options.message.channel;
    this.client = options.message.client;
    this.voiceChannel = options.message.member.voiceChannel;

    this.prefix = options.prefix;
    this.command = options.command;
    this.botLanguages = Object.keys(options.message.client.i18next.store.data);
    this.language = this.botLanguages.includes(options.language) ?
      options.language :
      this.message.language || process.env.DEFAULT_LANG;
    this.query = options.query;
    this.args = options.args;
    this.t = options.message.client.i18next.getFixedT(this.language);

    this.executeMessage = this._executeMessage.bind(this);
    this.emoji = this._emoji.bind(this);
    this.send = this._send.bind(this);
    this.edit = this._edit.bind(this);
    this.sendMessage = options.message.channel.send;
    this.message.language = this.language;

    this.canEmbed = this.guild ? this.channel.permissionsFor(this.guild.me).has('EMBED_LINKS') : true
  }

  _emoji(name = 'QUESTION', options) {
    const { id, other } = Object.assign({ id: false, other: null }, options);
    name = name.toUpperCase();

    const custom = getCustomEmoji(name) || (other && getCustomEmoji(other));
    const normal = getDefaultEmoji(name) || (other && getDefaultEmoji(other));

    if (this.guild && this.channel.permissionsFor(this.guild.me).has('USE_EXTERNAL_EMOJIS') && custom) {
      const emoji = this.client.emojis.get(custom);
      if (emoji) return id ? emoji.id : emoji.toString();
    }
    return normal || false;
  }

  _send(embed) {
    return this.executeMessage(embed);
  }

  _edit(msg, embed) {
    return this.executeMessage(embed, msg);
  }

  _executeMessage(embed, msg) {
    if (embed instanceof SimplicityEmbed) {
      const permissions = this.channel.permissionsFor(this.guild.me);
      const embedPermission = permissions.has('EMBED_LINKS');
      if (!embed.text && !embedPermission) throw Error(`${this.command.name}: Has no embed.text`);
      else if (embed.text && !embedPermission) {
        if (permissions.has('ATTACH_FILES')) embed.optionsText.attachments = embed.textImages.map((url, i) =>
          new MessageAttachment(url, `image${i}.png`)
        );

        const text = TextUtils.parse(TextUtils.parseImage(embed.text, embed.textImages, permissions), {
          t: this.t,
          emoji: this.emoji,
          embed });
        return msg ? msg.edit(text, embed.optionsText) : this.channel.send(text, embed.optionsText);
      }
    }
    return msg ? msg.edit(embed) : this.channel.send(embed);
  }
}

module.exports = CommandContext;
