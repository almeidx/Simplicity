const { Command, CommandError, SimplicityEmbed } = require('../..')

class Language extends Command {
  constructor (client) {
    super(client)
    this.name = 'language'
    this.aliases = ['lang', 'l', 'botlanguage']
    this.category = 'bot'
    this.requirements = {
      argsRequired: true,
      permissions: ['MANAGE_GUILD'] }
  }

  async run ({ author, client, guild, query: lang, send, t }) {
    const botLanguages = Object.keys(client.i18next.store.data).map(i => `\`${i}\``).join(', ')
    if (!botLanguages.includes(lang)) throw new CommandError('commands:language.invalidLang', { botLanguages })

    const currentLanguage = await client.database.guilds.get(guild.id).then(i => i.lang).catch(() => null)
    if (currentLanguage && lang === currentLanguage) throw new CommandError('commands:language.alreadySet', { lang })

    const data = await client.database.guilds.edit(guild.id, { lang }).catch(() => null)
    if (!data) throw new CommandError('commands:language.failed')

    const embed = new SimplicityEmbed({ author, t })
      .setTitle('commands:language.done')
      .setDescription('commands:language.success', { lang })
    await send(embed)
  }
}

module.exports = Language
