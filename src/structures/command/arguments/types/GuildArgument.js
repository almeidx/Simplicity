'use strict';

const CommandError = require('../../CommandError.js');
const Argument = require('./Argument.js');

class GuildArgument extends Argument {
  static parse(arg, { t, client }) {
    if (!arg) return;
    const guild = client.guilds.cache.get(arg);
    if (!guild) throw new CommandError(t('errors:invalidGuild'));
    return guild;
  }
}

module.exports = GuildArgument;
