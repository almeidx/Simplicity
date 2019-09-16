'use strict';

const { REGEX: { REGEX } } = require('./Constants');
const { Collection } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

class Utils {
  static convertDateLang(t, time) {
    return moment.duration(time).format(`D[ ${t('common:date.days')}], H[ ${t('common:date.hours')}],\n ` +
      `m[ ${t('common:date.minutes')}], s[ ${t('common:date.seconds')}]`);
  }

  static getImageHex(hex) {
    return `http://www.colourlovers.com/img/${hex}/200/200/Sminted.png`;
  }

  static getServerIconURL(guild) {
    if (guild.iconURL()) return guild.iconURL({ size: 2048 });
    else return `https://guild-default-icon.herokuapp.com/${guild.nameAcronym}`;
  }

  static getJoinPosition(id, guild) {
    if (!guild.member(id)) return;

    const array = guild.members.array();
    array.sort((a, b) => a.joinedAt - b.joinedAt);

    const result = array.map((m, i) => ({ index: i, id: m.user.id })).find((m) => m.id === id);
    return (result && result.index) || null;
  }

  static cleanString(str, minLength = 0, maxLength = 1024) {
    str = String(str);
    return str.slice(minLength, maxLength - 3) + (str.length > maxLength - 3 ? '...' : '');
  }

  static code(str, lang, minLength = 0, maxLength = 1024) {
    str = String(str);
    return `\`\`\`${lang}\n${str.slice(minLength, maxLength - 3) + (str.length > maxLength - 3 ? '...' : '')}\n\`\`\``;
  }

  static checkTick(condition) {
    return condition ? '#TICK_YES' : '#TICK_NO';
  }

  static fixText(t) {
    if (typeof t !== 'string') return false;
    return t[0].toUpperCase() + t.slice(1).toLowerCase();
  }

  static escapeRegExp(str) {
    return str.replace(REGEX, '\\$&');
  }

  static isEmpty(i) {
    if (!i) return true;
    else if (i.constructor === Object) return Object.keys(i).length === 0;
    else if (i.constructor === Collection) return i.size === 0;
    else if (i.constructor === Map) return i.size === 0;
    else if (Array.isArray(i)) return i.length === 0;
    else return false;
  }
}

module.exports = Utils;
