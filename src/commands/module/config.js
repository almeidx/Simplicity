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
    });
    this.registerSubCommand(PrefixCommand, { aliases: ['p', 'setp', 'setprefix'] });
    this.registerSubCommand(LanguageCommand, { aliases: ['l', 'lang', 'setlang', 'setlanguage', 'setl'] });
    this.registerSubCommand(StarboardCommand, { aliases: ['star', 's', 'setstarboard'] });
    this.registerSubCommand(DisableCommand, {
      aliases: ['disablecommands', 'disable-command', 'disablecmd', 'cmddisable'],
      name: 'disablecommand',
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
