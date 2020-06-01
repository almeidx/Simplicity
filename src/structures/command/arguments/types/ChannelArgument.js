'use strict';

const CommandError = require('../../CommandError');
const Argument = require('./Argument');
const MENTION_REGEX = /(<#)?([0-9]{16,18})>?$/;
const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k];

const searchOn = (local, id, arg) =>
  local.channels.cache.get(id) ||
  local.channels.cache.find((c) => c.name.toLowerCase().includes(arg.toLowerCase()))
;

const ChannelTypes = {
  category: 'category',
  dm: 'dm',
  news: 'news',
  text: 'text',
  voice: 'voice',
};

class ChannelArgument extends Argument {
  static parseOptions(options = {}) {
    const opts = {
      ...super.parseOptions(options),
      acceptCategory: defVal(options, 'acceptCategory', false),
      canBeHiddenBot: defVal(options, 'canBeHiddenBot', false),
      canBeHiddenUser: defVal(options, 'canBeHiddenUser', false),
      onlySameGuild: defVal(options, 'onlySameGuild', true),
      types: options.types || [ChannelTypes.text],
    };

    if (typeof opts.types === 'string') {
      opts.types = [opts.types];
    }

    if (!opts.types.every((p) => ChannelTypes[p])) {
      throw new Error('Channel type invalid');
    }

    return opts;
  }

  static parse(arg, { t, client, guild, member }) {
    if (!arg) return;

    const regexResult = MENTION_REGEX.exec(arg);
    const id = regexResult && regexResult[2];

    let channel = searchOn(guild, id, arg);
    if (!this.onlySameGuild) channel = channel || searchOn(client, id, arg);

    if (!channel) throw new CommandError(t('errors:invalidChannel'));

    for (const i in ChannelTypes) {
      const type = ChannelTypes[i];
      if (!this.types.includes(type) && channel.type === type) {
        throw new CommandError(t('errors:invalidChannel'));
      }
    }

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

module.exports = ChannelArgument;
