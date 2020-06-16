/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
  Message, TextChannel, DMChannel, MessageAdditions, Client,
} from 'discord.js';
import Config from '../config';
import { REGEX } from './Constants';

/**
 * Contains various general-purpose utility methods
 */
export default class Util {
  /**
   * Checks if a value is empty
   * @param val The value to be checked
   * @returns If the value is empty
   */
  static isEmpty(val: any): boolean {
    if ([false, null, undefined].includes(val)) return true;
    if (typeof val === 'number') return val === 0;
    if (typeof val === 'boolean') return false;
    if (['function', 'string'].includes(typeof val) || Array.isArray(val)) return val.length === 0;
    if (val instanceof Error) return val.message === '';
    if (val.toString === Object.prototype.toString) {
      const type = val.toString();
      if (['[object File]', '[object Map]', '[object Set]'].includes(type)) return val.size === 0;
      if (type === '[object Object]') return Object.keys(val).length === 0;
    }

    return false;
  }

  /**
   * Makes the text proper cased. Uppercase at beginning of the sentence and lowercase thereafter
   * @param text The text that will be capitalized
   * @returns The proper cased text
   */
  static capitalize(text: string) {
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Checks if something is a promise
   * @param val The value to be checked
   * @returns If the value is a promise
   */
  static isPromise(val: Promise<any> | any) {
    return val && Object.prototype.toString.call(val) === '[object Promise]' && typeof val.then === 'function';
  }

  /**
   * Slices strings to meet certain length limits
   * @param str The string to be sliced
   * @param start The zero-based index at which to begin extraction
   * @param maxLength The maximum length of the string
   * @returns The sliced string
   */
  static sliceString(str: string, start = 0, maxLength = 1024) {
    const end = str.length > maxLength ? maxLength - 3 : maxLength;
    if (end <= 0) return '...';
    return `${str.slice(start, end)}${str.length > maxLength ? '...' : ''}`;
  }

  /**
   * Makes the provided string a code block
   * @param str The string to be transformed
   * @param lang The language of the code block
   * @param start The zero-based index at which to begin extraction
   * @param maxLength The maximum length of the string
   * @returns The string in a code block.
   */
  static code(str: string, lang: string, start = 0, maxLength = 1024) {
    return `\`\`\`${lang}\n${Util.sliceString(str, start, maxLength)}\n\`\`\``;
  }

  static perString(str: string, fn: (str: string, index: number) => any, length = 1024) {
    let state = str;
    for (let i = 0; state.length !== 0; i + 1) {
      fn(state.slice(0, length), i);
      state = state.slice(length);
    }
  }

  static canSendEmbed(message: Message): boolean {
    if (message.channel instanceof DMChannel) return true;
    return message.channel
      .permissionsFor(String(message.guild?.me?.id))
      ?.has('EMBED_LINKS')
      ?? true;
  }

  static async sendPrivateMessage(
    client: Client,
    configName: keyof typeof Config['CHANNELS'],
    content: MessageAdditions,
  ): Promise<void> {
    const channel = client.channels.cache.get(Config.CHANNELS[configName]);
    if (channel instanceof TextChannel) await channel.send(content);
  }

  static escapeRegExp(str: string): string {
    return str.replace(REGEX.REGEX, '\\$&');
  }
}
