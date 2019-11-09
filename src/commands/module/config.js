'use strict';

const { Command, SimplicityEmbed } = require('@structures');
const PrefixCommand = require('./prefix');
const LanguageCommand = require('./language');
const StarboardCommand = require('./starboard');
const DisableCommand = require('./disable');

class Config extends Command {
  constructor(client) {
    super(client, {
      name: 'config',
      category: 'module',
      cooldown: 60000,
      aliases: ['configuration', 'serversettings', 's', 'serverconfig', 'serverconfiguration'],
      requirements: {
        permissions: ['MANAGE_GUILD'],
        requireDatabase: true,
        guildOnly: true,
      },
      subcommands: [
        new PrefixCommand(client, { aliases: ['p', 'setp', 'setprefix'] }),
        new LanguageCommand(client, { aliases: ['l', 'lang', 'setlang', 'setlanguage', 'setl'] }),
        new StarboardCommand(client, { aliases: ['star', 's', 'setstarboard'] }),
        new DisableCommand(client, {
          name: 'disablecommand',
          aliases: ['disablecommands', 'disable-command', 'disablecmd', 'cmddisable', 'cmddisable'],
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
