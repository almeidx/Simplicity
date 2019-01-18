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
      embed.setDescription('commands:help.about', { prefix: prefix })
      embed.setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
      categories.filter(c => c.name !== 'help').each((cmds, i) => embed.addField(`categories:${i}.name`, `${t(`categories:${i}.description`)}\n${cmds.keyArray().map(c => `\`${c}\``).join(', ')}`))
      send(embed)
    }
    const command = this.client.fetchCommand(args[0])
    if (command && command.name === 'help') {
      return send(embed.setDescription('commands:help.commandHelp'), { error: true })
    } if (command) {
      embed.setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
      embed.setTitle(command.name)
      if (t(`commands:${command.name}.description`) !== `${command.name}.description`) embed.setDescription(`commands:${command.name}.description`)
      if (t(`commands:${command.name}.usage`) !== `${command.name}.usage`) embed.addField(`${emoji('USAGE')} ${t('commands:help.usage')}`, `commands:${command.name}.usage`)
      if (command.aliases.length !== 0) embed.addField(`${emoji('ALIASES')} ${t('commands:help.aliases')}`, command.aliases)
      send(embed)
    } else {
      send(embed.setDescription(`commands:help.commandUndefined`), { error: true })
    }
  }
}
module.exports = Help
