const { Command, SimplicityEmbed } = require('../..')
const PrefixCommand = require('./prefix')
const LanguageCommand = require('./language')

const aliasesPrefix = [ 'p', 'setp', 'setprefix' ]
const aliasesLanguage = [ 'l', 'lang', 'setlang', 'setlanguage', 'setl' ]

class Config extends Command {
  constructor (client) {
    super(client)
    this.category = 'bot'
    this.aliases = [ 'configuration', 'serversettings', 's', 'serverconfig', 'serverconfiguration' ]
    this.requirements = { permissions: [ 'MANAGE_GUILD' ] }
    this.subcommands = [
      new PrefixCommand(client, aliasesPrefix),
      new LanguageCommand(client, aliasesLanguage) ]
  }

  run ({ author, language, prefix, send, t }) {
    const embed = new SimplicityEmbed({ author, t })
      .addField('» $$commands:config.prefix', prefix)
      .addField('» $$commands:config.language', language)
    return send(embed)
  }
}

module.exports = Config
