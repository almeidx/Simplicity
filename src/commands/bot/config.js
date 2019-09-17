'use strict';

const { Command, SimplicityEmbed } = require('../..');
const PrefixCommand = require('./prefix');
const LanguageCommand = require('./language');

const aliasesPrefix = ['p', 'setp', 'setprefix'];
const aliasesLanguage = ['l', 'lang', 'setlang', 'setlanguage', 'setl'];

class Config extends Command {
  constructor(client) {
    super(client, {
      category: 'bot',
      cooldown: 60000,
      aliases: ['configuration', 'serversettings', 's', 'serverconfig', 'serverconfiguration'],
      requirements: {
        permissions: ['MANAGE_GUILD'],
        requireDatabase: true,
      },
      subcommands: [
        new PrefixCommand(client, { aliases: aliasesPrefix }),
        new LanguageCommand(client, { aliases: aliasesLanguage }),
      ],
    });
  }

  run({ author, language, prefix, send, t }) {
    const embed = new SimplicityEmbed({ author, t })
      .addField('» $$commands:config.prefix', prefix)
      .addField('» $$commands:config.language', language);
    return send(embed);
  }
}

module.exports = Config;
