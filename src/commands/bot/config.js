'use strict';

const { Command, SimplicityEmbed } = require('../..');
const PrefixCommand = require('./prefix');
const LanguageCommand = require('./language');
const StarboardCommand = require('../guild/starboard');
const DisableCommand = require('../guild/disable');

const aliasesPrefix = ['p', 'setp', 'setprefix'];
const aliasesLanguage = ['l', 'lang', 'setlang', 'setlanguage', 'setl'];
const aliasesStarboard = ['star', 's', 'setstarboard'];
const aliasesDisable = ['disablecommands', 'disable-command', 'disablecmd', 'cmddisable', 'cmddisable'];


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
        new DisableCommand(client, {
          name: 'disablecommand',
          aliases: aliasesDisable,
        }),
      ],
    });
  }

  run({ guild, guildData, author, language, prefix, send, t }) {
    const channel = guild.channels.find((c) => c.id === guildData.starboard);
    const disableChannels = guildData.disableChannels
      .map((id) => guild.channels.get(id))
      .filter((ch) => ch)
      .map((ch) => ch.toString());

    const text = disableChannels.length ? disableChannels.join(', ') : '$$commands:config.noDisableChannel';

    const embed = new SimplicityEmbed({ author, t })
      .addField('» $$commands:config.prefix', prefix, true)
      .addField('» $$commands:config.language', language, true)
      .addField('» $$commands:config.starboard', channel ? channel.toString() : '$$commands:config.moduleOff', true)
      .addField('» $$commands:config.disableChannels', text);
    return send(embed);
  }
}

module.exports = Config;
