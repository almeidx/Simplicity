const { Command, SimplicityEmbed, PermissionsUtils } = require('../../')

class Help extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['h', 'commands']
    this.category = 'bot'
  }

  run ({ send, args, t, prefix, emoji, author }) {
    const categories = this.client.categories
    const name = this.client.user.username

    const embed = new SimplicityEmbed({ t, author })
      .setAuthor(this.client.user)

    if (args.length === 0) {
      embed.setDescription(t('commands:help.about', { prefix, name }))
      categories.filter(c => c.name !== 'help').each((cmds, i) => {
        if (i === 'dev' && !PermissionsUtils.verifyDev(author.id, this.client)) return
        return embed.addField(`categories:${i}.name`, `${t(`categories:${i}.description`)}\n${cmds.keyArray().map(c => `\`${c}\``).join(', ')}`)
      })
      return send(embed)
    }

    if (!this.client.commands.has(args[0].toLowerCase())) {
      return send(embed.setDescription('commands:help.commandUndefined').setError())
    }

    const command = this.client.commands.fetch(args[0].toLowerCase())

    if (command.name === 'help') {
      return send(embed.setDescription('commands:help.commandHelp').setError())
    }

    embed.setTitle(command.name)

    if (t(`commands:${command.name}.description`) !== `${command.name}.description`) embed.setDescription(`commands:${command.name}.description`, { prefix })

    if (t(`commands:${command.name}.usage`) !== `${command.name}.usage`) embed.addField(`${emoji('USAGE')} ${t('commands:help._usage')}`, t(`commands:${command.name}.usage`, { prefix }))

    if (command.aliases.length !== 0) embed.addField(`${emoji('ALIASES')} ${t('commands:help.aliases')}`, command.aliases)

    return send(embed)
  }
}

module.exports = Help
