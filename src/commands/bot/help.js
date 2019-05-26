const { Command, SimplicityEmbed, PermissionsUtils, Utils } = require('../../')
const { fixText } = Utils

class Help extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'h', 'commands', 'cmd', 'cmds' ]
    this.category = 'bot'
  }

  run ({ author, client, emoji, prefix, query, send, t }) {
    const categories = client.categories
    const name = client.user.username

    const embed = new SimplicityEmbed({ author, emoji, t })
      .setAuthor(client.user)

    if (!query) {
      embed.setDescription('commands:help.about', { prefix, name })
      categories.filter(c => c.name !== 'help').each((cmds, i) => {
        if (i === 'dev' && !PermissionsUtils.verifyDev(author.id, client)) return
        return embed.addField(`categories:${i}.name`, cmds.keyArray().map(c => `\`${c}\``).join(', '))
      })
      return send(embed)
    }

    query = query.toLowerCase()

    if (!client.commands.has(query))
      return send(embed.setDescription('commands:help.commandUndefined').setError())

    const command = client.commands.fetch(query)

    if (command.name === 'help')
      return send(embed.setDescription('commands:help.commandHelp').setError())

    embed.setTitle(fixText(query))

    if (t(`commands:${command.name}.description`) !== `${command.name}.description`)
      embed.setDescription(`commands:${command.name}.description`, { prefix })

    if (t(`commands:${command.name}.usage`) !== `${command.name}.usage`)
      embed.addField(`#USAGE ${t('commands:help._usage')}`, t(`commands:${command.name}.usage`, { prefix }))

    if (command.aliases.length)
      embed.addField(`#ALIASES ${t('commands:help.aliases')}`, command.aliases)

    return send(embed)
  }
}

module.exports = Help
