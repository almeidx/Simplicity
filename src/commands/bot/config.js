const { Command, CommandError, SimplicityEmbed } = require('../..')

class Config extends Command {
  constructor (client) {
    super(client)
    this.category = 'bot'
    this.aliases = ['configuration', 'serversettings', 's', 'serverconfig', 'serverconfiguration']
    this.WIP = true
    this.requirements = { permissions: ['MANAGE_GUILD'] }
  }

  async run ({ args, author, client, guild, send, t }) {
    const embed = new SimplicityEmbed({ author, t })

    let data = await client.database.guilds.get(guild.id)
    if (!data) data = await client.database.guilds.create(guild.id)

    const key = args[0] && args[0].toLowerCase()
    const value = args[1]
    const botLanguages = Object.keys(client.i18next.store.data)

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
      if (value) {
        if (botLanguages.includes(value)) {
          const edited = await client.database.guilds.edit(guild.id, {lang: value}).catch(() => null)
          if (!edited) throw new CommandError('commands:config.failed')
          else {
            embed
              .setTitle('utils:success')
              .setDescription('commands:config.langChanged', {value})
            return send(embed)
          }
        } else {
          throw new CommandError('commands:config.invalidLanguage')
        }
      } else {
        embed
          .setTitle('commands:config.language')
          .setDescription(data.lang || process.env.DEFAULT_LANG)
        return send(embed)
      }
    } else if (prefixArray.includes(key)) {
      if (value) {
        if (value.length <= 15) {
          const edited = await client.database.guilds.edit(guild.id, { prefix: value }).catch(() => null)
          if (!edited) throw new CommandError('commands:config.failed')
          else {
            embed
              .setTitle('utils:success')
              .setDescription('commands:config.prefixChanged', { value })
            return send(embed)
          }
        } else {
          throw new CommandError('commands:prefix.multiCharacters')
        }
      } else {
        embed
          .setTitle('commands:config.prefix')
          .setDescription(data.prefix || process.env.PREFIX)
        return send(embed)
      }
    } else {
      embed
        .addField('» $$commands:config.prefix', data.prefix || process.env.PREFIX)
        .addField('» $$commands:config.language', data.lang || process.env.DEFAULT_LANG)
      return send(embed)
    }
  }
}

module.exports = Config
