'use strict';

const { DEVELOPER_IDS } = require('@data/config');
const moment = require('moment');
const { REGEX: { REGEX } } = require('./Constants');
require('moment-duration-format');

/**
 * Contains various general-purpose utility methods.
 * @class Util
 */
class Util {
  /**
   * Creates an instance of Util.
   */
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Converts a date into it's appropriate language.
   * @param {I18next} t The i18next language instance.
   * @param {time} time The time.
   * @returns {string} The formatted time.
   */
  static convertDateLang(t, time) {
    return moment.duration(time).format(`D[ ${t('common:date.days')}], H[ ${t('common:date.hours')}],\n ` +
      `m[ ${t('common:date.minutes')}], s[ ${t('common:date.seconds')}]`);
  }

  /**
   * Returns an url containing an image with the corresponding hex background.
   * @param {string} hex The hex value.
   * @returns {string} The image url.
   */
  static getImageHex(hex) {
    return `http://www.colourlovers.com/img/${hex}/200/200/Sminted.png`;
  }

  /**
   * Resolves a guild icon url.
   * @param {Guild} guild The guild.
   * @returns {string} The icon url.
   */
  static getServerIconURL(guild) {
    const icon = guild.iconURL({ dynamic: true, size: 4096 });
    if (icon) return icon;
    else return `https://guild-default-icon.herokuapp.com/${encodeURIComponent(guild.nameAcronym)}`;
  }

  /**
   * Slices strings to meet certain length limits.
   * @param {string} str The string to be sliced.
   * @param {number} [minLength=0] The minimum length of the string.
   * @param {number} [maxLength=1024] The maximum length of the string.
   * @returns {string} The sliced string.
   */
  static cleanString(str, minLength = 0, maxLength = 1024) {
    str = String(str);
    return str.slice(minLength, maxLength - 3) + (str.length > maxLength - 3 ? '...' : '');
  }

  /**
   * Makes the provided string a code block.
   * @param {string} str The string to be transformed.
   * @param {string} lang The language of the code block.
   * @param {number} [minLength=0] The minimum length of the string.
   * @param {number} [maxLength=1024] The maximum length of the string.
   * @returns {string} The string in a code block.
   */
  static code(str, lang, minLength = 0, maxLength = 1024) {
    str = String(str);
    return `\`\`\`${lang}\n${Util.cleanString(str, minLength, maxLength)}\n\`\`\``;
  }

  /**
   * Resolves the boolean value of something and returns a tick name according to the value.
   * @param {*} condition The condition to be checked.
   * @returns {string} The corresponding tick.
   */
  static checkTick(condition) {
    return condition ? '#TICK_YES' : '#TICK_NO';
  }

  /**
   * Makes the text proper cased. Uppercase at beginning of the sentence and lowercase thereafter.
   * @param {string} text The text to be made proper cased.
   * @returns {string} The proper cased text.
   */
  static fixText(text) {
    if (typeof text !== 'string') return '???';
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Escapes special RegExp characters.
   * @param {string} str String with potential special RegExp characters to escape.
   * @returns {string} The escaped string.
   */
  static escapeRegExp(str) {
    return str.replace(REGEX, '\\$&');
  }

  /**
   * Checks if something is empty as in if their size/length is 0.
   * @param {*} val The value to be checked if empty.
   * @returns {boolean} Whether it is empty or not.
   */
  static isEmpty(val) {
    if ([false, null, undefined].includes(val)) return true;

    if (typeof val === 'number') return val === 0;
    if (typeof val === 'boolean') return false;
    if (['function', 'string'].includes(typeof val) || Array.isArray(val)) return val.length === 0;

    if (val instanceof Error) return val.message === '';

    if (val.toString === Object.prototype.toString) {
      const type = val.toString();

      if (['[object File]', '[object Map]', '[object Set]'].includes(type)) return val.size === 0;

      if (type === '[object Object]') {
        for (const key in val) {
          if (Object.prototype.hasOwnProperty.call(val, key)) return false;
        }

        return true;
      }
    }

    return false;
  }

  /**
   * Resolves the Developer IDs
   * @returns {Array<string>} An array containing the developer's IDs.
   */
  static getDevs() {
    return DEVELOPER_IDS || [];
  }

  /**
   * Checks if something is a promise.
   * @param {*} val The value to be checked.
   * @returns {boolean} If the value was a promise.
   */
  static isPromise(val) {
    return val && Object.prototype.toString.call(val) === '[object Promise]' && typeof val.then === 'function';
  }

  /**
   * Destructures an object using the provided properties.
   * @param {Object<*>} obj The object to be destructured.
   * @param {...string} props The properties of the object.
   * @returns {*} The final value, or the object, if empty.
   */
  static dest(obj, ...props) {
    if (Util.isEmpty(obj)) return obj;

    let main = obj;
    for (const prop of props) {
      if (!main || !prop) return main;
      main = main[prop];
    }

    return main;
  }
}

module.exports = Util;
