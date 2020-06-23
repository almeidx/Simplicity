/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */

// eslint-disable-next-line max-classes-per-file
import { format } from 'date-fns';
import { Message, GuildChannel } from 'discord.js';
import path from 'path';
import figures from 'figures';

enum Colors {
  FgBlue = '\x1b[34m',
  FgCyan = '\x1b[36m',
  FgGreen = '\x1b[32m',
  FgLightMagenta = '\x1b[95m',
  FgRed = '\x1b[31m',
  FgWhite = '\x1b[37m',
  FgYellow = '\x1b[33m',
  fgDarkGray = '\x1b[90m'
}

class TerminalFormatter {
  static bold(text: string): string {
    return `\x1b[1m${text}\x1b[0m`;
  }

  static underlined(text: string): string {
    return `\x1b[4m${text}\x1b[0m`;
  }

  static color(color: Colors, text: string): string {
    return `${color + text}\x1b[0m`;
  }
}
/**
 * Contains various logger utility methods
 */
export default class Logger {
  /**
   * Gets the current timestamp
   * @returns The current timestamp formatted
   */
  static formatTimestamp(timestamp = Date.now()): string {
    return TerminalFormatter.color(Colors.fgDarkGray, format(timestamp, 'd LLL HH:mm:ss'));
  }

  static formatFilename(filename: string): string {
    return `${filename.replace(/.js|.ts|.json/g, '')}`;
  }

  /**
   * Logs to console
   * @param color The color of the log
   * @param message The message to log
   * @param type The type of log
   */
  static createLog(
    logType: 'warn' | 'log' | 'error',
    figure: string,
    color: Colors,
    messages: string[],
  ): void {
    const formattedfigure = TerminalFormatter.color(color, figure);
    const filename = Logger.formatFilename(Logger.getFilename());
    const timestamp = Logger.formatTimestamp(Date.now());
    const message = TerminalFormatter.color(color, messages.join(', '));

    return console[logType](`${formattedfigure} ${timestamp} ${filename} ${message}`);
  }

  static getFilename(): string {
    const _ = Error.prepareStackTrace;
    Error.prepareStackTrace = (error, stack) => stack;
    const { stack } = new Error();
    Error.prepareStackTrace = _;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const callers: string[] = stack.map((x) => x.getFileName());

    const firstExternalFilePath = callers.find((x: string) => x !== callers[0]);

    return firstExternalFilePath ? path.basename(firstExternalFilePath) : 'anonymous';
  }

  /**
   * Logs normally
   * @param message The message to log
   */
  static log(...messages: any[]): void {
    return Logger.createLog('log', figures.arrowRight, Colors.FgGreen, messages);
  }

  static success(...messages: any[]): void {
    return Logger.createLog('log', figures.tick, Colors.FgGreen, messages);
  }

  static info(...messages: any[]): void {
    return Logger.createLog('log', figures.info, Colors.FgGreen, messages);
  }

  /**
   * Logs an error
   * @param message The message to log
   */
  static error(...messages: any[]): void {
    return Logger.createLog('error', figures.cross, Colors.FgRed, messages);
  }

  /**
   * Logs a warn
   * @param message The message to log
   */
  static warn(...messages: any[]): void {
    return Logger.createLog('warn', figures.warning, Colors.FgYellow, messages);
  }

  /**
   * Logs a command.
   * @param ctx Context of the command.
   * @returns {void}
   */
  static logCommand({
    guild, channel, author, cleanContent,
  }: Message) {
    let message = '';
    if (guild) {
      message += `${TerminalFormatter.color(Colors.FgBlue, guild.name)} `;
      message += `${TerminalFormatter.color(Colors.FgCyan, `#${(channel as GuildChannel).name}`)} `;
    }
    message += `${TerminalFormatter.color(Colors.FgGreen, `@${author.username}`)} `;
    const figure = TerminalFormatter.color(Colors.FgLightMagenta, figures.play);
    return console.warn(`${figure} ${Logger.formatTimestamp()} ${message}${cleanContent}`);
  }
}
