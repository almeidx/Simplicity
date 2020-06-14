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
 * Main SimplicityEmbed class.
 */
class SimplicityEmbed extends MessageEmbed {
  options: EmbedOptions;

  /**
   * Creates an instance of SimplicityEmbed
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
    const o: ImageURLOptions = { size: 4096 };
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
   * Sets the color of the embed to red
   */
  setError(): this {
    return this.setColor(EmbedColors.error);
  }

  getParseTextOptions(options: TOptions): ParseTextOptions {
    return {
      tOptions: options,
      t: this.options.t,
      embed: this,
    };
  }

  /**
   * Sets the SimplicityEmbed's author
   * @param name= The name of the author
   * @param iconURL The resolvable to resolve the icon from
   * @param url The resolvable to resolve the url from
   * @param options The options for the author
   */
  setAuthor(
    name: EmbedInput,
    iconURL?: EmbedInput | null,
    url?: EmbedInput | null,
    options: TOptions = {},
  ): this {
    const parseName = SimplicityEmbed.resolveName(name);
    const parseIcon = iconURL ? this.resolveImage(iconURL) : this.resolveImage(name);
    const parseUrl = url ? this.resolveImage(url) : undefined;
    return super.setAuthor(
      TextUtil.parse(parseName, this.getParseTextOptions(options)),
      parseIcon,
      parseUrl,
    );
  }

  /**
   * Set the SimplicityEmbed's footer
   * @param text The text of the footer
   * @param iconURL The resolvable to resolve the icon from
   * @param options The options for the footer
   * @returns The embed
   */
  setFooter(text: EmbedInput, iconURL: EmbedInput | null = null, options: TOptions = {}): this {
    const parseText = SimplicityEmbed.resolveName(text);
    const parseIconURL = iconURL
      ? this.resolveImage(iconURL)
      : SimplicityEmbed.hasSupport(text) ? this.resolveImage(text) : undefined;

    return super.setFooter(
      TextUtil.parse(
        parseText,
        this.getParseTextOptions(options),
      ),
      parseIconURL,
    );
  }

  /**
   * Set the SimplicityEmbed's description
   * @param description The embed's description
   * @param options The options for the descripton
   */
  setDescription(description: string, options: TOptions = {}): this {
    return super.setDescription(TextUtil.parse(description, this.getParseTextOptions(options)));
  }

  /**
   * Set the SimplicityEmbed's title
   * @param title The embed's title
   * @param options The options for the title
   * @returns The embed
   */
  setTitle(title: string, options: TOptions = {}): this {
    return super.setTitle(TextUtil.parse(title, this.getParseTextOptions(options)));
  }

  /**
   * Add a field to the SimplicityEmbed
   * @param name The name for the field
   * @param value The value for the field
   * @param inline Whether the field should be inline
   * @param options The options for the field name
   * @param valueOptions The options for the field value
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
   * Adds multiple fields to the embed
   * @param fields The fields that will be added
   * @returns The embed
   */
  addFields(...fields: FieldOptions[]): this {
    for (const data of fields) {
      const {
        name, value, inline, options = {}, valueOptions = {},
      } = data;
      this.fields.push(
        SimplicityEmbed.normalizeField(
          TextUtil.parse(String(name), this.getParseTextOptions(options)),
          TextUtil.parse(String(value), this.getParseTextOptions(valueOptions)),
          inline,
        ),
      );
    }
    return this;
  }

  /**
   * Set the SimplicityEmbed's thumbnail
   * @param url The url to the image
   */
  setThumbnail(url: EmbedInput): this {
    return super.setThumbnail(this.resolveImage(url));
  }

  /**
   * Set the SimplicityEmbed's image
   * @param url The url to the image
   */
  setImage(url: EmbedInput): this {
    return super.setImage(this.resolveImage(url));
  }
}

export default SimplicityEmbed;
