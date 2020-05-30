'use strict';

const { Command, SimplicityEmbed } = require('@structures');
const DisableCommand = require('./disable');
const LanguageCommand = require('./language');
const PrefixCommand = require('./prefix');
const StarboardCommand = require('./starboard');

class Config extends Command {
  constructor(client) {
    super(client, 'config', {
      aliases: ['configuration', 'serversettings', 's', 'serverconfig', 'serverconfiguration'],
      category: 'module',
      cooldown: 5000,
      requirements: {
        guildOnly: true,
        permissions: ['MANAGE_GUILD'],
        requireDatabase: true,
      },
      subcommands: [
        new PrefixCommand(client, { aliases: ['p', 'setp', 'setprefix'] }),
        new LanguageCommand(client, { aliases: ['l', 'lang', 'setlang', 'setlanguage', 'setl'] }),
        new StarboardCommand(client, { aliases: ['star', 's', 'setstarboard'] }),
        new DisableCommand(client, {
          aliases: ['disablecommands', 'disable-command', 'disablecmd', 'cmddisable', 'cmddisable'],
          name: 'disablecommand',
        }),
      ],
    });
  }

  run({ guild, guildData, author, language, prefix, send, t }) {
    const channel = guild.channels.cache.find((c) => c.id === guildData.starboard);
    const disableChannels = guildData.disableChannels
      .map((id) => guild.channels.cache.get(id))
      .filter((ch) => ch)
      .map((ch) => `${ch}`);

    const text = disableChannels.length ? disableChannels.join(', ') : '$$commands:config.noDisableChannel';

    const embed = new SimplicityEmbed({ author, t })
      .addField('» $$commands:config.prefix', prefix, true)
      .addField('» $$commands:config.language', language, true)
      .addField('» $$commands:config.starboard', channel ? `${channel}` : '$$commands:config.moduleOff', true)
      .addField('» $$commands:config.disableChannels', text);
    return send(embed);
  }
}

module.exports = Config;
