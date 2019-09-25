'use strict';

const CommandError = require('../structures/command/CommandError');
const Parameter = require('../structures/Parameter');

const MENTION_REGEX = /^(?:<#?)?([0-9]{16,18})(?:>)?$/;

class ChannelParameter extends Parameter {
  static parseOptions(options) {
    return Object.assign({
      ...super.parseOptions(options),
      canBeHidden: true,
      canBeHiddenBot: true,
      checkStartsWith: true,
      checkEndsWith: true,
    }, options);
  }

  static parseMessageErrors(options = {}) {
    return Object.assign({
      ...super.parseMessageErrors(options),
      canBeHiddenUser: 'errors:hiddenChannel',
      canBeHiddenBot: 'errors:hiddenChannelBot',
    }, options.errors);
  }

  static verifyExceptions(channel, exceptions = {}, { guild }) {
    exceptions = this.setupOptions(exceptions);

    // Const hiddenChannel = channel.permissionsFor()
    const hiddenChannelBot = channel.permissionsFor(guild.me).has('READ_MESSAGES');

    // If (!exceptions.canBeHidden && !hiddenChannel)
    // throw new CommandError(exceptions.errors.canBeHidden, { onUsage: true })
    if (!exceptions.canBeHiddenBot && !hiddenChannelBot) {
      throw new CommandError(exceptions.errors.canBeHiddenBot, { onUsage: true });
    }

    return true; // Role
  }

  static search(query, { guild }, options) {
    options = this.setupOptions(options);
    if (!query || typeof query !== 'string' || !guild) return;
    query = query.toLowerCase();
    const regexResult = MENTION_REGEX.exec(query);
    const id = regexResult && regexResult[1];
    const getID = id && guild.channels && guild.channels.get(id);
    const findName = guild.channels.find((r) => r.name.toLowerCase() === query);
    const findStartName = options.checkStartsWith && guild.channels.find((r) => r.name.toLowerCase().startsWith(query));
    const findEndsName = options.checkEndsWith && guild.channels.find((r) => r.name.toLowerCase().endsWith(query));

    return getID || findName || findStartName || findEndsName || null;
  }
}

module.exports = ChannelParameter;
