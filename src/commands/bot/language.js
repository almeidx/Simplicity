const { Command, CommandError, SimplicityEmbed } = require('../..')

class Language extends Command {
  constructor (client) {
    super(client, {
      name: 'language',
      aliases: ['lang', 'l', 'botlanguage'],
      category: 'bot',
      requirements: {
        argsRequired: true,
        permissions: [ 'MANAGE_GUILD' ]
      }
    })
  }

  async run ({ author, botLanguages, client, guild, language, query, send, t }) {
    const lang = botLanguages.find(i => i.toLowerCase() === query.toLowerCase())
    if (!lang)
      throw new CommandError('commands:language.invalidLang', { botLanguages: botLanguages.map(i => `\`${i}\``).join(', ') })

    if (language === lang)
      throw new CommandError('commands:language.alreadySet', { lang })

    const data = await client.database.guilds.edit(guild.id, { lang }).catch(() => null)
    if (!data)
      throw new CommandError('commands:language.failed')

    const embed = new SimplicityEmbed({ author, t })
      .setTitle('commands:language.done')
      .setDescription('commands:language.success', { lang })
    await send(embed)
  }
}

module.exports = Language
