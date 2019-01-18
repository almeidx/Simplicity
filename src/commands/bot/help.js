const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class Help extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['h', 'commands']
    this.category = 'bot'
  }

  run ({ send, args, t, prefix, emoji }) {
    const categories = this.client.categories
    const embed = new MessageEmbed()
    if (args.length === 0) {
      embed.setDescription(t('commands:help.about', { prefix, botname: this.client.user.username }))
      embed.setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
      categories.filter(c => c.name !== 'help').each((cmds, i) => embed.addField(`categories:${i}.name`, `${t(`categories:${i}.description`)}\n${cmds.keyArray().map(c => `\`${c}\``).join(', ')}`))
      console.log(embed.description)
      return send(embed)
    }

    if (!this.client.commands.has(args[0])) {
      return send(embed.setDescription(`commands:help.commandUndefined`), { error: true })
    }

    const command = this.client.fetchCommand(args[0])

    if (command.name === 'help') {
      return send(embed.setDescription('commands:help.commandHelp'), { error: true })
    }

    embed.setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
    embed.setTitle(command.name)
    if (t(`commands:${command.name}.description`) !== `${command.name}.description`) embed.setDescription(`commands:${command.name}.description`)
    if (t(`commands:${command.name}.usage`) !== `${command.name}.usage`) embed.addField(`${emoji('USAGE')} ${t('commands:help.usage')}`, `commands:${command.name}.usage`)
    if (command.aliases.length !== 0) embed.addField(`${emoji('ALIASES')} ${t('commands:help.aliases')}`, command.aliases)
    return send(embed)
  }
}

module.exports = Help
