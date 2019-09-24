'use strict';

const { Command, SimplicityEmbed } = require('../..');
const PrefixCommand = require('./prefix');
const LanguageCommand = require('./language');
const StarboardCommand = require('./starboard');

const aliasesPrefix = ['p', 'setp', 'setprefix'];
const aliasesLanguage = ['l', 'lang', 'setlang', 'setlanguage', 'setl'];
const aliasesStarboard = ['star', 's', 'setstarboard'];

class Config extends Command {
  constructor(client) {
    super(client, {
      category: 'bot',
      cooldown: 60000,
      aliases: ['configuration', 'serversettings', 's', 'serverconfig', 'serverconfiguration'],
      requirements: {
        permissions: ['MANAGE_GUILD'],
        requireDatabase: true,
        guildOnly: true,
      },
      subcommands: [
        new PrefixCommand(client, { aliases: aliasesPrefix }),
        new LanguageCommand(client, { aliases: aliasesLanguage }),
        new StarboardCommand(client, { aliases: aliasesStarboard }),
      ],
    });
  }

  run({ guild, guildData, author, language, prefix, send, t }) {
    const channel = guild.channels.find((c) => c.id === guildData.starboard);
    const embed = new SimplicityEmbed({ author, t })
      .addField('» $$commands:config.prefix', prefix)
      .addField('» $$commands:config.language', language)
      .addField('» $$commands:config.starboard', channel ? channel.toString() : '$$errors:noDefined');
    return send(embed);
  }
}

module.exports = Config;
