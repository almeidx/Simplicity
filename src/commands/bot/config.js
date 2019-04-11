const { Command, CommandContext, SimplicityEmbed } = require('../..')

class Config extends Command {
  constructor (client) {
    super(client)
    this.category = 'bot'
    this.aliases = ['configuration', 'serversettings', 's', 'serverconfig', 'serverconfiguration']
    this.requirements = { permissions: ['MANAGE_GUILD'] }
  }

  async run ({ args, author, client, guild, message, prefix, send, t }) {
    const embed = new SimplicityEmbed({ author, t })

    let data = await client.database.guilds.get(guild.id)
    if (!data) data = await client.database.guilds.create(guild.id)

    const key = args && args.length && args.shift().toLowerCase()
    const value = args && args.join(' ')

    const langArray = []
    for (let x = 0; x < 3; x++) {
      langArray.push(t(`commands:config.languageKeys.${x}`))
    }
    const prefixArray = []
    for (let x = 0; x < 2; x++) {
      prefixArray.push(t(`commands:config.prefixKeys.${x}`))
    }

    if (!key) {
      embed
        .addField('» $$commands:config.prefix', data.prefix || process.env.PREFIX)
        .addField('» $$commands:config.language', data.lang || process.env.DEFAULT_LANG)
      return send(embed)
    } else if (langArray.includes(key)) {
      const LanguageCommand = client.commands.fetch('language')

      LanguageCommand._run(new CommandContext({ args, author, client, guild, message, query: value, prefix, send, t }))
    } else if (prefixArray.includes(key)) {
      const PrefixCommand = client.commands.fetch('prefix')

      PrefixCommand._run(new CommandContext({ args, author, client, guild, message, query: value, prefix, send, t }))
    } else {
      embed
        .addField('» $$commands:config.prefix', data.prefix || process.env.PREFIX)
        .addField('» $$commands:config.language', data.lang || process.env.DEFAULT_LANG)
      return send(embed)
    }
  }
}

module.exports = Config
