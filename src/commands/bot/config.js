const { Command, SimplicityEmbed } = require('../..')
const PrefixCommand = require('./prefix')
const LanguageCommand = require('./language')

class Config extends Command {
  constructor (client) {
    super(client)
    this.category = 'bot'
    this.aliases = ['configuration', 'serversettings', 's', 'serverconfig', 'serverconfiguration']
    this.requirements = { permissions: ['MANAGE_GUILD'] }
    this.subcommands = [new PrefixCommand(client, { aliases: ['p'] }), new LanguageCommand(client, { aliases: ['l'] })]
  }

  run ({ author, prefix, send, t, language }) {
    const embed = new SimplicityEmbed({ author, t })
      .addField('» $$commands:config.prefix', prefix)
      .addField('» $$commands:config.language', language)
    return send(embed)
  }
}

module.exports = Config
