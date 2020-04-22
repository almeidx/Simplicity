'use strict';

const CommandError = require('../../CommandError');
const Parameter = require('./Parameter');

const MENTION_REGEX = /(<#)?([0-9]{16,18})>?$/;
const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k];

const searchOn = (local, id, arg) =>
  local.channels.cache.get(id) || local.channels.cache.find((c) => c.name.toLowerCase().includes(arg.toLowerCase()))
;

class ChannelParameter extends Parameter {
  static parseOptions(options = {}) {
    return {
      ...super.parseOptions(options),
      acceptCategory: defVal(options, 'acceptCategory', false),
      acceptDM: defVal(options, 'acceptDM', false),
      acceptGroup: defVal(options, 'acceptGroup', false),
      acceptNews: defVal(options, 'acceptNews', false),
      acceptStore: defVal(options, 'acceptStore', false),
      acceptText: defVal(options, 'acceptText', false),
      acceptVoice: defVal(options, 'acceptVoice', false),
      canBeHiddenBot: defVal(options, 'canBeHiddenBot', false),
      canBeHiddenUser: defVal(options, 'canBeHiddenUser', false),
      onlySameGuild: defVal(options, 'onlySameGuild', true),
    };
  }

  static parse(arg, { t, client, guild, member }) {
    if (!arg) return;

    const regexResult = MENTION_REGEX.exec(arg);
    const id = regexResult && regexResult[2];

    let channel = searchOn(guild, id, arg);
    if (!this.onlySameGuild) channel = channel || searchOn(client, id, arg);

    const check = (option, type) => {
      if (!option && channel.type === type) throw new CommandError(t('errors:invalidChannelType', { type }));
    };

    if (!channel) throw new CommandError(t('errors:invalidChannel'));

    check(this.acceptDM, 'dm');
    check(this.acceptGroup, 'group');
    check(this.acceptText, 'text');
    check(this.acceptVoice, 'voice');
    check(this.acceptCategory, 'category');
    check(this.acceptNews, 'news');
    check(this.acceptStore, 'store');

    const hiddenChannel = channel.permissionsFor(member).has('VIEW_CHANNEL');
    if (!this.canBeHiddenUser && !hiddenChannel) {
      throw new CommandError('errors:hiddenChannel', { onUsage: false });
    }

    const hiddenChannelBot = channel.permissionsFor(guild.me).has('VIEW_CHANNEL');
    if (!this.canBeHiddenBot && !hiddenChannelBot) {
      throw new CommandError('errors:hiddenChannelBot', { onUsage: false });
    }

    return channel;
  }
}

module.exports = ChannelParameter;
