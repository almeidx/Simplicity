'use strict';

const { Guild, GuildMember, Message, MessageEmbed, User } = require('discord.js');
const CommandContext = require('@command/CommandContext');
const TextUtils = require('@utils/TextUtils');
const { getServerIconURL } = require('@utils/Utils');

const types = { normal: process.env.COLOR, error: 'RED', warn: 0xfdfd96 };

function checkName(resolvable) {
  if (resolvable instanceof User) return resolvable.tag;
  if (resolvable instanceof GuildMember) return resolvable.user.tag;
  if (resolvable instanceof Guild) return resolvable.name;
}

function checkIcon(resolvable) {
  const o = { size: 2048 };
  if (resolvable instanceof User) return resolvable.displayAvatarURL(o);
  if (resolvable instanceof GuildMember) return resolvable.user.displayAvatarURL(o);
  if (resolvable instanceof Guild) return getServerIconURL(resolvable);
}

class SimplicityEmbed extends MessageEmbed {
  constructor(embedResolvable = {}, options = {}, data = {}) {
    super(data);
    this.dataFixedT = {};
    this.fieldsFixedT = [];
    this.text = '';
    this._text = '';
    this.optionsText = {};
    this.textImages = [];
    this.setupEmbed(embedResolvable, options);
  }

  setupEmbed(embedResolvable, options) {
    this.options = Object.assign({
      autoFooter: true,
      autoAuthor: true,
      autoTimestamp: true,
      type: 'normal',
    }, options);

    if (embedResolvable instanceof User) embedResolvable = { author: embedResolvable };
    if (embedResolvable instanceof GuildMember) embedResolvable = { author: embedResolvable.user };

    if (typeof embedResolvable === 'function' && embedResolvable.name === 'fixedT') embedResolvable = {
      t: embedResolvable,
    };

    if (embedResolvable instanceof Message) {
      const context = new CommandContext({ message: embedResolvable });
      embedResolvable = {
        author: context.author,
        t: context.t,
      };
    }

    embedResolvable = Object.assign({ author: null, t: null, emoji: null }, embedResolvable);

    this.t = embedResolvable.t;
    this.emoji = embedResolvable.emoji;

    if (embedResolvable.author) {
      if (this.options.autoAuthor) this.setAuthor(embedResolvable.author);
      if (this.options.autoFooter) this.setFooter(embedResolvable.author.tag);
      if (this.options.autoTimestamp) this.setTimestamp();
    }

    const color = types[this.options.type] || types.normal || 'BLUE';
    this.setColor(color);
  }

  setupOptions(options) {
    return { t: this.t, emoji: this.emoji, options };
  }

  setError() {
    return this.setColor('RED');
  }

  setAuthor(name = '', iconURL = null, url = null, options = {}) {
    const authorName = checkName(name);
    const authorNameIcon = checkIcon(name);
    const authorIcon = checkIcon(iconURL);

    if (authorName) name = authorName;
    if (authorNameIcon && !iconURL) iconURL = authorNameIcon;
    if (authorIcon) iconURL = authorIcon;

    this.dataFixedT.author = { name, iconURL, url, options };
    return super.setAuthor(TextUtils.parse(name, this.setupOptions(options)), iconURL, url);
  }

  setFooter(text = '', iconURL = null, options = {}) {
    const footerTextName = checkName(text);
    const footerTextIcon = checkIcon(text);
    const footerIcon = checkIcon(iconURL);

    if (footerTextName) text = footerTextName;
    if (footerTextIcon && !iconURL) iconURL = footerTextIcon;
    if (footerIcon) iconURL = footerIcon;

    this.dataFixedT.footer = { text, iconURL, options };
    return super.setFooter(TextUtils.parse(text, this.setupOptions(options)), iconURL);
  }

  setDescription(description, options = {}) {
    this.dataFixedT.description = { description, options };
    return super.setDescription(TextUtils.parse(description, this.setupOptions(options)));
  }

  setTitle(title, options, canTrans = true) {
    this.dataFixedT.title = { title, options };
    const result = !canTrans ? title : TextUtils.parse(title, this.setupOptions(options));
    return super.setTitle(result);
  }

  addField(name = '', value = '', inline = null, options = {}, valueOptions = {}) {
    this.fieldsFixedT.push({ name, value, inline, options, valueOptions });
    return super
      .addField(
        TextUtils.parse(name, this.setupOptions(options)),
        TextUtils.parse(value, this.setupOptions(valueOptions)),
        inline
      );
  }

  setThumbnail(url) {
    const thumbnail = checkIcon(url) || url;
    return super.setThumbnail(thumbnail);
  }

  setImage(url) {
    const image = checkIcon(url) || url;
    return super.setImage(image);
  }

  setText(text, optionsText = {}, options = {}, images = null) {
    options = this.setupOptions(options);
    this._text = { text, options };
    this.text = Array.isArray(text) ?
      text.map((t) => TextUtils.parse(t, options)).join('\n') :
      TextUtils.parse(text, options);
    this.optionsText = optionsText;
    if (images) {
      if (Array.isArray(images)) this.textImages = images;
      else this.textImages.push(images);
    }

    return this;
  }
}

module.exports = SimplicityEmbed;
