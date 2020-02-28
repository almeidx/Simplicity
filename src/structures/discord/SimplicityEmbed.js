'use strict';

const { Guild, GuildMember, Message, MessageEmbed, User } = require('discord.js');
const CommandContext = require('@command/CommandContext');
const TextUtil = require('@util/TextUtil');
const { getServerIconURL } = require('@util/Util');

const types = { normal: process.env.COLOR, error: 'RED', warn: 0xfdfd96 };

/**
 * Resolves a name.
 * @param {Guild|GuildMember|User} resolvable The resolvable to be resolved.
 * @return {string|void} The resolved name.
 * @private
 */
function checkName(resolvable) {
  if (resolvable instanceof User) return resolvable.tag;
  if (resolvable instanceof GuildMember) return resolvable.user.tag;
  if (resolvable instanceof Guild) return resolvable.name;
}

/**
 * Resolves an icon.
 * @param {Guild|GuildMember|User} resolvable The resolvable to be resolved.
 * @return {string|void} The resolved image url.
 * @private
 */
function checkIcon(resolvable) {
  const o = { size: 2048 };
  if (resolvable instanceof User) return resolvable.displayAvatarURL(o);
  if (resolvable instanceof GuildMember) return resolvable.user.displayAvatarURL(o);
  if (resolvable instanceof Guild) return getServerIconURL(resolvable);
}

/**
 * Main SimplicityEmbed class.
 * @class SimplicityEmbed
 * @extends {MessageEmbed}
 */
class SimplicityEmbed extends MessageEmbed {
  /**
   * Creates an instance of SimplicityEmbed.
   * @param {Object} [embedResolvable={}] The embed resolvable.
   * @param {Object} [options={}] The options for the embed.
   * @param {Object} [data={}] The data of the embed.
   */
  constructor(embedResolvable = {}, options = {}, data = {}) {
    super(data);
    this.dataFixedT = {};
    this.fieldsFixedT = [];
    this.text = '';
    this._text = '';
    this.optionsText = {};
    this.textImages = [];
    this._setupEmbed(embedResolvable, options);
  }

  /**
   * Private method that resolves the embed's options.
   * @param {Object} embedResolvable The embed resolvable.
   * @param {Object} options The embed's options.
   * @return {SimplicityEmbed} The embed.
   * @private
   */
  _setupEmbed(embedResolvable, options) {
    this.options = Object.assign({
      autoFooter: true,
      autoAuthor: true,
      autoTimestamp: true,
      type: 'normal',
    }, options);

    if (embedResolvable instanceof User) embedResolvable = { author: embedResolvable };
    if (embedResolvable instanceof GuildMember) embedResolvable = { author: embedResolvable.user };

    if (typeof embedResolvable === 'function' && embedResolvable.name === 'fixedT') {
      embedResolvable = {
        t: embedResolvable,
      };
    }

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

    return this;
  }

  /**
   * Resolves the options.
   * @param {Object} options The options.
   * @return {Object} The finalized options.
   * @private
   */
  _setupOptions(options) {
    return { t: this.t, emoji: this.emoji, options };
  }

  /**
   * Sets the color of the embed to red.
   * @return {SimplicityEmbed} The embed.
   */
  setError() {
    return this.setColor('RED');
  }

  /**
   * Sets the SimplicityEmbed's color.
   * @param {string} color The color to set.
   * @return {SimplicityEmbed} The embed.
   */
  setColor(color) {
    return super.setColor(color);
  }

  /**
   * Sets the SimplicityEmbed's author.
   * @param {Guild|GuildMember|User|string} [name='???'] The name of the author.
   * @param {Guild|GuildMember|User|string} [iconURL=null] The resolvable to resolve the icon from.
   * @param {GuildMember|User|string} [url=null] The resolvable to resolve the url from.
   * @param {Object} [options={}] The options for the author.
   * @return {SimplicityEmbed} The embed.
   */
  setAuthor(name = '???', iconURL = null, url = null, options = {}) {
    const authorName = checkName(name);
    const authorNameIcon = checkIcon(name);
    const authorIcon = checkIcon(iconURL);

    if (authorName) name = authorName;
    if (authorNameIcon && !iconURL) iconURL = authorNameIcon;
    if (authorIcon) iconURL = authorIcon;

    this.dataFixedT.author = { name, iconURL, url, options };
    return super.setAuthor(TextUtil.parse(name, this._setupOptions(options)), iconURL, url);
  }

  /**
   * Set the SimplicityEmbed's footer.
   * @param {Guild|GuildMember|User|string} [text='???'] The text of the footer.
   * @param {Guild|GuildMember|User|string} [iconURL=null] The resolvable to resolve the icon from.
   * @param {Object} [options={}] The options for the footer.
   * @return {SimplicityEmbed} The embed.
   */
  setFooter(text = '???', iconURL = null, options = {}) {
    const footerTextName = checkName(text);
    const footerTextIcon = checkIcon(text);
    const footerIcon = checkIcon(iconURL);

    if (footerTextName) text = footerTextName;
    if (footerTextIcon && !iconURL) iconURL = footerTextIcon;
    if (footerIcon) iconURL = footerIcon;

    this.dataFixedT.footer = { text, iconURL, options };
    return super.setFooter(TextUtil.parse(text, this._setupOptions(options)), iconURL);
  }

  /**
   * Set the SimplicityEmbed's description.
   * @param {string} [description='???'] The embed's description.
   * @param {Object} [options={}] The options for the descripton.
   * @return {SimplicityEmbed} The embed.
   */
  setDescription(description = '???', options = {}) {
    this.dataFixedT.description = { description, options };
    return super.setDescription(TextUtil.parse(description, this._setupOptions(options)));
  }

  /**
   * Set the SimplicityEmbed's title.
   * @param {string} [title='???'] The embed's title.
   * @param {Object} [options={}] The options for the title.
   * @param {boolean} [canTrans=true] If the title can be translated.
   * @return {SimplicityEmbed} The embed.
   */
  setTitle(title = '???', options = {}, canTrans = true) {
    this.dataFixedT.title = { title, options };
    const result = !canTrans ? title : TextUtil.parse(title, this._setupOptions(options));
    return super.setTitle(result);
  }

  /**
   * Add a field to the SimplicityEmbed.
   * @param {string} [name='???'] The name for the field.
   * @param {string} [value='???'] The value for the field.
   * @param {boolean} [inline=false] Whether the field should be inline.
   * @param {Object} [options={}] The options for the field name.
   * @param {Object} [valueOptions={}] The options for the field value.
   * @return {SimplicityEmbed} The embed.
   */
  addField(name = '???', value = '???', inline = null, options = {}, valueOptions = {}) {
    this.fieldsFixedT.push({ name, value, inline, options, valueOptions });
    return this
      .addFields({
        name: TextUtil.parse(name, this._setupOptions(options)),
        value: TextUtil.parse(value, this._setupOptions(valueOptions)),
        inline,
      });
  }

  /**
   * Adds multiple fields to the embed.
   * @param {...EmbedField} fields The fields that will be added.
   * @return {SimplicityEmbed} The embed.
   */
  addFields(...fields) {
    return super.addFields(fields);
  }

  /**
   * Set the SimplicityEmbed's thumbnail.
   * @param {Guild|GuildMember|User|string} url The url to the image.
   * @return {SimplicityEmbed} The embed.
   */
  setThumbnail(url) {
    const thumbnail = checkIcon(url) || url;
    return super.setThumbnail(thumbnail);
  }

  /**
   * Set the SimplicityEmbed's image.
   * @param {GuildMember|User|string} url The url to the image.
   * @return {SimplicityEmbed} The embed.
   */
  setImage(url) {
    const image = checkIcon(url) || url;
    return super.setImage(image);
  }

  /**
   * Sets the embed text.
   * @param {string} [text='???'] The text to add.
   * @param {Object} [optionsText={}] The options for the text.
   * @param {Object} [options={}] The options for the text.
   * @param {string} [images=null] The image URL for the embed.
   * @return {SimplicityEmbed} The embed.
   */
  setText(text = '???', optionsText = {}, options = {}, images = null) {
    options = this._setupOptions(options);
    this._text = { text, options };
    this.text = Array.isArray(text) ?
      text.map((t) => TextUtil.parse(t, options)).join('\n') :
      TextUtil.parse(text, options);
    this.optionsText = optionsText;
    if (images) {
      if (Array.isArray(images)) this.textImages = images;
      else this.textImages.push(images);
    }

    return this;
  }
}

module.exports = SimplicityEmbed;
