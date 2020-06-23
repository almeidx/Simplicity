/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import crypto from 'crypto';
import {
  Guild, GuildMember, MessageAttachment, MessageEmbed, User, MessageEmbedOptions, ImageURLOptions,
} from 'discord.js';
import { TFunction, TOptions } from 'i18next';
import {
  ImageUtil, TextUtil, ParseTextOptions,
} from '../../util';
import Config from '../../config';

const EmbedColors = { error: 'RED', normal: Config.COLOR, warn: '0xfdfd96' } as const;

type EmbedResolvable = User | GuildMember | TFunction
type EmbedInput = Guild | GuildMember | User | string;

interface EmbedOptions {
  autoAuthor: boolean;
  autoFooter: boolean;
  autoTimestamp: boolean;
  type: keyof typeof EmbedColors;
  t?: TFunction;
}

interface FieldOptions {
  inline?: boolean;
  name: string | number;
  options?: TOptions;
  value: string | number;
  valueOptions?: TOptions;
}

/**
 * Represents a rich embed in a message.
 */
export default class Embed extends MessageEmbed {
  options: EmbedOptions;

  /**
   * @param embedResolvable The embed resolvable
   * @param options The options for the embed
   * @param data The data of the embed
   */
  constructor(
    embedResolvable?: EmbedResolvable | null,
    options: Partial<EmbedOptions> = {},
    data: MessageEmbed | MessageEmbedOptions = {},
  ) {
    super(data);

    this.options = {
      autoAuthor: true,
      autoFooter: true,
      autoTimestamp: true,
      type: 'normal',
      ...options,
    };
    if (embedResolvable) {
      if (embedResolvable instanceof User) {
        this.setTemplate(embedResolvable);
      } else if (embedResolvable instanceof GuildMember) {
        this.setTemplate(embedResolvable.user);
      } else {
        this.options.t = embedResolvable;
      }
    }

    const color = EmbedColors[this.options.type] || EmbedColors.normal;

    this.setColor(color);
  }

  setTemplate(user: User): void {
    if (this.options.autoAuthor) this.setAuthor(user);
    if (this.options.autoFooter) this.setFooter(user.tag);
    if (this.options.autoTimestamp) this.setTimestamp();
  }

  /**
   * Resolves a name
   * @param resolvable The resolvable to be resolved
   * @returns The resolved name
   */
  static resolveName(resolvable: EmbedInput): string {
    if (resolvable instanceof User) return resolvable.tag;
    if (resolvable instanceof GuildMember) return resolvable.user.tag;
    if (resolvable instanceof Guild) return resolvable.name;
    return resolvable;
  }

  static hasSupport(resolvable: any): boolean {
    return resolvable instanceof GuildMember
      || resolvable instanceof GuildMember
      || resolvable instanceof Guild;
  }

  /**
   * Resolves an icon
   * @param resolvable The resolvable to be resolved
   * @returns The resolved image url
   */
  resolveImage(resolvable: EmbedInput): string {
    const o: ImageURLOptions & { dynamic?: boolean } = { dynamic: true, format: 'png', size: 4096 };
    if (resolvable instanceof User) return resolvable.displayAvatarURL(o);
    if (resolvable instanceof GuildMember) return resolvable.user.displayAvatarURL(o);
    if (resolvable instanceof Guild) {
      const icon = resolvable.iconURL(o);
      if (icon) return icon;
      const defaulIcon = ImageUtil.renderGuildIcon(resolvable.nameAcronym);
      const name = `${crypto.randomBytes(20).toString('hex')}.png`;
      super.attachFiles([new MessageAttachment(defaulIcon, name)]);
      return `attachment://${name}`;
    }
    return resolvable;
  }

  /**
   * Sets the color of this embed to red
   */
  setError(): this {
    return this.setColor(EmbedColors.error);
  }

  getParseTextOptions(options: TOptions): ParseTextOptions {
    return {
      tOptions: options,
      t: this.options.t,
    };
  }

  /**
   * Sets the author of this embed.
   * @param name The name of the author
   * @param iconURL The icon URL of the author
   * @param url The URL of the author
   * @param options The options of the author
   */
  setAuthor(
    name: EmbedInput,
    iconURL?: EmbedInput | null,
    url?: EmbedInput | null,
    options: TOptions = {},
  ): this {
    const parseName = Embed.resolveName(name);
    const parseIcon = iconURL
      ? this.resolveImage(iconURL) : typeof name !== 'string' ? this.resolveImage(name) : undefined;
    const parseUrl = url ? this.resolveImage(url) : undefined;
    return super.setAuthor(
      TextUtil.parse(parseName, this.getParseTextOptions(options)),
      parseIcon,
      parseUrl,
    );
  }

  /**
   * Sets the footer of this embed.
   * @param text The text of the footer
   * @param iconURL The icon URL of the footer
   * @param options The options of the footer
   */
  setFooter(text: EmbedInput, iconURL: EmbedInput | null = null, options: TOptions = {}): this {
    const parseText = Embed.resolveName(text);
    const parseIconURL = iconURL
      ? this.resolveImage(iconURL)
      : Embed.hasSupport(text) ? this.resolveImage(text) : undefined;

    return super.setFooter(
      TextUtil.parse(
        parseText,
        this.getParseTextOptions(options),
      ),
      parseIconURL,
    );
  }

  /**
   * Sets the description of this embed.
   * @param description The description
   * @param options The options of the descripton
   */
  setDescription(description: string, options: TOptions = {}): this {
    return super.setDescription(TextUtil.parse(description, this.getParseTextOptions(options)));
  }

  /**
   * Sets the title of this embed.
   * @param title The title
   * @param options The options of the title
   */
  setTitle(title: string, options: TOptions = {}): this {
    return super.setTitle(TextUtil.parse(title, this.getParseTextOptions(options)));
  }

  /**
   * Adds a field to the embed (max 25).
   * @param name The name of this field
   * @param value The value of this field
   * @param inline If this field will be displayed inline
   * @param options The options of the field name
   * @param valueOptions The options of the field value
   */
  addField(
    name: string | number,
    value: string | number,
    inline = false,
    options: TOptions = {},
    valueOptions: TOptions = {},
  ): this {
    return this
      .addFields({
        inline,
        name,
        options,
        value,
        valueOptions,
      });
  }

  /**
   * Adds fields to the embed (max 25).
   * @param fields The fields to add
   */
  addFields(...fields: FieldOptions[]): this {
    for (const data of fields) {
      const {
        name, value, inline, options = {}, valueOptions = {},
      } = data;
      this.fields.push(
        Embed.normalizeField(
          TextUtil.parse(String(name), this.getParseTextOptions(options)),
          TextUtil.parse(String(value), this.getParseTextOptions(valueOptions)),
          inline,
        ),
      );
    }
    return this;
  }

  /**
   * Sets the thumbnail of this embed.
   * @param url The URL of the thumbnail
   */
  setThumbnail(url: EmbedInput): this {
    return super.setThumbnail(this.resolveImage(url));
  }

  /**
   * Sets the image of this embed.
   * @param url The URL of the image
   */
  setImage(url: EmbedInput): this {
    return super.setImage(this.resolveImage(url));
  }
}
