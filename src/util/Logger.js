'use strict';

const moment = require('moment');
const LogFile = require('./LogFile');
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
   * @param {...*} text The text to log.
   * @param {string} [type='log'] The type of log.
   * @returns {void}
   * @private
   */
  static _log(color, text, type = 'log') {
    console[type](`${Logger.timestampColor} ${setColor(color, text)}`);
    if (process.env.NODE_ENV !== 'development') {
      return LogFile.addInfo(`${Logger.timestamp} ${type.toUpperCase()} - ${text}`);
    }
  }

  /**
   * Logs normally.
   * @param {...*} text The text to log
   * @returns {void}
   */
  static log(text) {
    return Logger._log('FgGreen', text);
  }

  /**
   * Logs an error.
   * @param {...*} text The text to log
   * @returns {void}
   */
  static error(text) {
    return Logger._log('FgRed', text, 'error');
  }

  /**
   * Logs a warn.
   * @param {...*} text The text to log
   * @returns {void}
   */
  static warn(text) {
    return Logger._log('FgYellow', text, 'warn');
  }

  /**
   * Logs a command.
   * @param {Object} object Object with multiple required properties
   * @param {User} object.author The author of the command.
   * @param {TextBasedChannel} object.channel The channel where the command was used.
   * @param {string} object.content The content of the command message.
   * @param {Guild} object.guild The guild where the command was used.
   * @returns {void}
   */
  static logCommand({ guild, channel, author, content }) {
    if (process.env.NODE_ENV === 'development') {
      const warn = setColor('FgYellow', '[Command]');
      const g = setColor('FgBlue', guild);
      const c = setColor('FgCyan', `#${channel}`);
      const u = setColor('FgGreen', `@${author}`);
      return console.warn(`${Logger._timestamp} ${warn} ${g} ${c} ${u} ${content}`);
    }
    return LogFile.addInfo(
      `${Logger.timestamp} COMMAND_USE - GUILD_ID: ${guild.id} USER_ID: ${author.id} CONTENT: ${content}`);
  }
}

module.exports = Logger;
