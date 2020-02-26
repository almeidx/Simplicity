'use strict';

const moment = require('moment');
moment.locale('pt-br');

const colors = {
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
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

  /**
   * Gets the current timestamp.
   * @return {string} The current timestamp formatted.
   * @private
   * @readonly
   */
  static get _timestamp() {
    return setColor('FgMagenta', moment().format('DD/MM/YYYY HH:mm:ss'));
  }
  /**
   * Logs to console.
   * @param {string} color The color of the log.
   * @param {string} [type='log'] The type of log.
   * @param {...*} text The text to log.
   * @return {void}
   * @private
   */
  static _log(color, type = 'log', text) {
    return console[type](`${Logger._timestamp} ${setColor(color, text)}`);
  }

  /**
   * Logs normally.
   * @param {...*} text The text to log
   * @return {void}
   */
  static log(text) {
    return Logger._log('FgGreen', 'log', text);
  }

  /**
   * Logs an error.
   * @param {...*} text The text to log
   * @return {void}
   */
  static error(text) {
    return Logger._log('FgRed', 'error', text);
  }

  /**
   * Logs a warn.
   * @param {...*} text The text to log
   * @return {void}
   */
  static warn(text) {
    return Logger._log('FgYellow', 'warn', text);
  }

  /**
   * Logs a command.
   * @param {Object} object Object with multiple required properties
   * @param {User} object.author The author of the command.
   * @param {TextBasedChannel} object.channel The channel where the command was used.
   * @param {string} object.content The content of the command message.
   * @param {Guild} object.guild The guild where the command was used.
   * @return {void}
   */
  static logCommand({ guild, channel, author, content }) {
    const warn = setColor('FgYellow', '[Command]');
    const g = setColor('FgBlue', guild);
    const c = setColor('FgCyan', `#${channel}`);
    const u = setColor('FgGreen', `@${author}`);
    return console.warn(`${Logger._timestamp} ${warn} ${g} ${c} ${u} ${content}`);
  }
}

module.exports = Logger;
