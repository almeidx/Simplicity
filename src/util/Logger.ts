/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import moment from 'moment';

moment.locale('pt-br');

enum Colors {
  FgBlue = '\x1b[34m',
  FgCyan = '\x1b[36m',
  FgGreen = '\x1b[32m',
  FgMagenta = '\x1b[35m',
  FgRed = '\x1b[31m',
  FgWhite = '\x1b[37m',
  FgYellow = '\x1b[33m',
};

const resetColor = '\x1b[0m';

const setColor = (color: Colors, text: string) => `${color + text + resetColor}`;

/**
 * Contains various logger utility methods.
 * @class Logger
 */
export default class Logger {
  /**
   * Gets the current timestamp.
   * @returns {string} The current timestamp formatted.
   * @private
   * @readonly
   */
  static get timestamp(): string {
    return setColor(Colors.FgMagenta, moment().format('DD/MM/YYYY HH:mm:ss'));
  }

  /**
   * Logs to console.
   * @param color The color of the log.
   * @param text The text to log.
   * @param type The type of log.
   * @returns {void}
   * @private
   */
  static createLog(color: Colors, text: any, consoleFn: (...args: any) => void): void {
    return consoleFn(`${Logger.timestamp} ${setColor(color, text)}`);
  }

  /**
   * Logs normally.
   * @param text The text to log
   */
  static log(text: any): void {
    return Logger.createLog(Colors.FgGreen, text, console.log);
  }

  /**
   * Logs an error.
   * @param text The text to log
   */
  static error(text: any): void {
    return Logger.createLog(Colors.FgRed, text, console.error);
  }

  /**
   * Logs a warn.
   * @param text The text to log
   */
  static warn(text: any): void {
    return Logger.createLog(Colors.FgYellow, text, console.warn);
  }

  // /**
  //  * Logs a command.
  //  * @param {Object} object Object with multiple required properties
  //  * @param {User} object.author The author of the command.
  //  * @param {TextBasedChannel} object.channel The channel where the command was used.
  //  * @param {string} object.content The content of the command message.
  //  * @param {Guild} object.guild The guild where the command was used.
  //  * @returns {void}
  //  */
  // static logCommand({
  //   guild, channel, author, content,
  // }) {
  //   const warn = setColor('FgYellow', '[Command]');
  //   const g = setColor('FgBlue', guild);
  //   const c = setColor('FgCyan', `#${channel}`);
  //   const u = setColor('FgGreen', `@${author}`);
  //   return console.warn(`${Logger._timestamp} ${warn} ${g} ${c} ${u} ${content}`);
  // }
}
