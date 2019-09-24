'use strict';

const CommandError = require('../structures/command/CommandError');
const Parameter = require('../structures/Parameter');

class GuildParameter extends Parameter {
  static parseOptions(options) {
    return Object.assign({
      ...super.parseOptions(options),
      canBeUnavailable: false,
      checkIncludes: false,
    }, options);
  }

  static parseMessageErrors(options = {}) {
    return Object.assign({
      ...super.parseMessageErrors(options),
      canBeUnavailable: 'errors:unavailableGuild',
    }, options.errors);
  }

  static search(query, { client, guild }, options) {
    options = this.setupOptions(options);
    if (!query) return guild;
    if (typeof query !== 'string') throw new Error(`The search input can't be type '${typeof query}'`);

    query = query.toLowerCase();

    const getID = client.guilds.get(query);

    const findName = client.guilds.find((g) => g.name.toLowerCase() === query);
    const findNameStarts = client.guilds.find((g) => g.name.toLowerCase().startsWith(query));
    const findNameEnds = client.guilds.find((g) => g.name.toLowerCase().endsWith(query));
    const findNameIncludes = client.guilds.find((g) => g.name.toLowerCase().includes(query));

    guild = getID || findName || findNameStarts || findNameEnds || findNameIncludes;

    if (!options.canBeUnavailable && !guild.available) throw new CommandError(options.errors.canBeUnavailable);

    return guild;
  }
}

module.exports = GuildParameter;
