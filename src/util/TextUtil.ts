import { MessageEmbed, Permissions } from 'discord.js';
import { TFunction, TOptions } from 'i18next';
import { SimplicityEmbed } from '../structures';

export interface ParseTextOptions {
  t?: TFunction,
  embed?: MessageEmbed | SimplicityEmbed,
  tOptions?: TOptions
}

/**
 * Contains various text related utility methods
 */
export default class TextUtil {
  /**
   * Resolves emotes, text and translations on strings
   * @param text The text to be resolved
   * @param options The options
   * @returns The resolved string
  */
  static parse(text: string, { t, tOptions = {} }: ParseTextOptions = {}): string {
    let result = text;
    if (t) result = TextUtil.parseTranslation(result, t, tOptions);

    return result;
  }

  static parseTranslation(text: string, t: TFunction, tOptions: TOptions): string {
    return text.replace(/\$\$\w+:\w+(?:\.?\w+?)+/gi, (s) => t(s.slice(2), tOptions));
  }

  /**
   * Parses an image from a string
   * @param text The text
   * @param imageURL The image url
   * @param permissions The permissions of the client
   * @returns The image url
   */
  static parseImage(text: string, imageURL: string, permissions: Permissions): string {
    const arrCount: string[] = [];
    if (!imageURL) return text;
    return text.replace(/(?:\?\{image\})(\S+)/gi, (_, a) => {
      arrCount.push(a);
      if (permissions.has('ATTACH_FILES')) return '';
      return imageURL[arrCount.indexOf(a)];
    });
  }
}
