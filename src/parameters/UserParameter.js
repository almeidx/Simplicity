'use strict';

const CommandError = require('@command/CommandError');
const Parameter = require('@structures/Parameter');

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/;

class UserParameter extends Parameter {
  static parseOptions(options) {
    return Object.assign({
      ...super.parseOptions(options),
      canBeAuthor: true,
      canBeBot: true,
      canBeUser: true,
      checkGlobally: true,
      checkIncludes: true,
    }, options);
  }

  static parseMessageErrors(options = {}) {
    return Object.assign({
      ...super.parseMessageErrors(options),
      canBeBot: 'errors:canBeBot',
      canBeAuthor: 'errors:canBeAuthor',
      canBeUser: 'errors:canBeUser',
    }, options.errors);
  }

  static verifyExceptions(user, exceptions = {}, { author }) {
    exceptions = this.setupOptions(exceptions);
    if (!exceptions.canBeAuthor && user.id === author.id) {
      throw new CommandError(
        exceptions.errors.canBeAuthor, { onUsage: true },
      );
    }
    if (!exceptions.canBeBot && user.bot) throw new CommandError(exceptions.errors.canBeBot, { onUsage: true });
    if (!exceptions.canBeUser && !user.bot) throw new CommandError(exceptions.errors.canBeAuthor, { onUsage: true });

    return user;
  }

  static async search(query, { client, guild }, options = {}) {
    if (typeof query !== 'string') throw new SyntaxError('query was invalid');

    options = this.setupOptions(options);
    query = query.toLowerCase();
    const regexResult = MENTION_REGEX.exec(query);
    const id = regexResult && regexResult[1];

    const guildMember = (p, u = false, m) => {
      if (guild) {
        if (u) {
          if (m) {
            return guild.members.cache.find((mem) => mem.user[p].toLowerCase()[m](query)) &&
              guild.members.cache.find((mem) => mem.user[p].toLowerCase()[m](query)).user;
          }
          return guild.members.cache.find((mem) => mem.user[p].toLowerCase() === query) &&
            guild.members.cache.find((mem) => mem.user[p].toLowerCase() === query).user;
        } else {
          if (m) {
            return guild.members.cache.find((mem) => mem[p].toLowerCase()[m](query)) &&
              guild.members.cache.find((mem) => mem[p].toLowerCase()[m](query)).user;
          }
          return guild.members.cache.find((mem) => mem[p].toLowerCase() === query) &&
            guild.members.cache.find((mem) => mem[p].toLowerCase() === query).user;
        }
      }
    };

    let getID;
    let findTag;
    let findUsername;
    let findUsernameStarts;
    let findUsernameEnds;
    let findUsernameIncludes;
    let findDisplay;
    let findDisplayStarts;
    let findDisplayEnds;
    let findDisplayIncludes;

    if (client) {
      getID = id && (client.users.cache.get(id) || (options.checkGlobally && await client.users.fetch(id).catch(() => null)));

      findTag = client.users.cache.find((m) => m.tag.toLowerCase() === query);
    }

    if (guild) {
      findUsername = guildMember('username', true);
      findUsernameStarts = guildMember('username', true, 'startsWith');
      findUsernameEnds = guildMember('username', true, 'endsWith');
      findUsernameIncludes = guildMember('username', true, 'includes');

      findDisplay = guildMember('displayName');
      findDisplayStarts = guildMember('displayName', false, 'startsWith');
      findDisplayEnds = guildMember('displayName', false, 'endsWith');
      findDisplayIncludes = guildMember('displayName', false, 'includes');
    }

    return getID || findTag || findUsername || findUsernameStarts || findUsernameEnds ||
      (options.checkIncludes && findUsernameIncludes) || findDisplay || findDisplayStarts || findDisplayEnds ||
      (options.checkIncludes && findDisplayIncludes) || null;
  }
}

module.exports = UserParameter;
