'use strict';

const { inspect } = require('util');
const moment = require('moment');
const LogFile = require('./LogFile');
const Util = require('./Util');
moment.locale('pt-br');

const colors = {
  FgBlue: '\x1b[34m',
  FgCyan: '\x1b[36m',
  FgGreen: '\x1b[32m',
  FgMagenta: '\x1b[35m',
  FgRed: '\x1b[31m',
  FgWhite: '\x1b[37m',
  FgYellow: '\x1b[33m',
};

const reset = '\x1b[0m';
const setColor = (c, text) => `${colors[c] + text + reset}`;

/**
 * Contains various logger utility methods.
 * @class Logger
 */
class Logger {
  /**
   * Creates an instance of Logger.
   */
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated`);
  }

  static get timestamp() {
    return moment().format('DD/MM/YYYY HH:mm:ss');
  }

  /**
   * Gets the current timestamp.
   * @returns {string} The current timestamp formatted.
   * @readonly
   */
  static get timestampColor() {
    return setColor('FgMagenta', Logger.timestamp);
  }

  /**
   * Logs to console.
   * @param {string} color The color of the log.
   * @param {string} [type='log'] The type of log.
   * @param {...*} text The text to log.
   * @returns {void}
   * @private
   */
  static _log(color, type, ...texts) {
    console[type](`${Logger.timestampColor} ${setColor(color, texts.join(' '))}`);
    if (process.env.NODE_ENV !== 'development') {
      return LogFile.addInfo(`${Logger.timestamp} ${type.toUpperCase()} - ${texts.join(' ')}`);
    }
  }

  /**
   * Logs normally.
   * @param {...*} text The text to log
   * @returns {void}
   */
  static log(...text) {
    return Logger._log('FgGreen', 'log', ...text);
  }

  /**
   * Logs an error.
   * @param {...*} text The text to log
   * @returns {void}
   */
  static error(...text) {
    return Logger._log('FgRed', 'error', ...text);
  }

  /**
   * Logs a warn.
   * @param {...*} text The text to log
   * @returns {void}
   */
  static warn(...text) {
    return Logger._log('FgYellow', 'warn', ...text);
  }

  /**
   * Logs a command.
   * @param {Message} message Message discordjs
   * @returns {void}
   */
  static logCommand(message) {
    const { guild, channel, author, content } = message;
    if (process.env.NODE_ENV === 'development') {
      const warn = setColor('FgYellow', '[Command]');
      const g = setColor('FgBlue', guild ? guild.name : 'DM');
      const c = setColor('FgCyan', `#${channel.name}`);
      const u = setColor('FgGreen', `@${author.username}`);
      return console.warn(`${Logger.timestampColor} ${warn} ${g} ${c} ${u} ${content}`);
    }
    return LogFile.addInfo(
      `${Logger.timestamp} COMMAND_USE - GUILD_ID: ${guild.id} USER_ID: ${author.id} ${Logger.resolveContent(message)}`,
    );
  }

  /** * Resolves the content of a message.
   * @param {Message} message The message from which it's content will be resolved.
   * @returns {string} The content.
   * */
  static resolveContent(message) {
    const { isEmpty } = Util;
    if (message.content && isEmpty(message.embeds) && isEmpty(message.attachments)) {
      return message.content;
    }
    let content = '';
    if (message.content) {
      content += `Content: ${message.content}\n`;
    }
    if (!isEmpty(message.embeds)) {
      let i = 1;
      for (const embed of message.embeds.values()) {
        content += `Embed ${i}: ${inspect(embed.toJSON(), { depth: 3 })}\n`; i++;
      }
    }
    if (!isEmpty(message.attachments)) {
      let i = 1;
      for (const attachment of message.attachments.values()) {
        content += `Attachment ${i}: ${attachment.url}`; i++;
      }
    }
    return content;
  }
}

module.exports = Logger;
