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
  static parse(text: string, { t, embed, tOptions = {} }: ParseTextOptions = {}): string {
    let result = text;
    if (embed) result = TextUtil.parseEmbed(result, embed);
    if (t) result = TextUtil.parseTranslation(result, t, tOptions);

    return result;
  }


  static parseEmbed(text: string, embed: MessageEmbed): string {
    return text.replace(/(?:@)\S+/g, (k) => {
      const keys = k.slice(1).split('.');
      let obj = embed;
      for (const key of keys) {
        if (!Object.hasOwnProperty.call(obj, key)) {
          return String(obj);
        }
        obj = Object.getPrototypeOf.call(obj, key);
      }
      return String(obj);
    });
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
