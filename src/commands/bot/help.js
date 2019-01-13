const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class Help extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['h', 'commands']
    this.description = 'This command shows my other commands.'
    this.usage = `Usage: **${process.env.PREFIX}help <module>**`
    this.category = 'Bot'
    this.argsRequired = false
  }
  run (message, args) {
    let embed = new MessageEmbed()
      .setTimestamp()
      .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
      .setColor(process.env.COLOR)
    if (args.length === 0) {
      embed.addField('Como eu funciono?', `Simplicity é um client com focus em moderação, utilidade, musica, e muito mais!\nO meu prefixo é: ${process.env.PREFIX}!\nPara usar os meus comandos, digite **${process.env.PREFIX}help <modulo>**.`)
      embed.addField('Modulos Existentes:', '**bot**, **server**, **moderation**')
      embed.setThumbnail(this.client.user.displayAvatarURL({ size: 2048 }))
    } else if (args.toLowerCase() === 'bot') {
      embed.addField('Bot Stuff', '`[]` = Required Parameters.\n`<>` = Optional Parameters.')
      embed.addField('Commands', `**${process.env.PREFIX}ping** - Shows the ping of the bot;\n**${process.env.PREFIX}uptime** - Shows the time the bot has been online for.`)
    } else if (args.toLowerCase() === ('server' || 'sv')) {
      embed.addField('Server Stuff', '`[]` = Required Parameters.\n`<>` = Optional Parameters.')
      embed.addField('Commands', `**${process.env.PREFIX}serverinfo** - Shows info about the server;\n**${process.env.PREFIX}servericon** - Shows the icon of the server.`)
    } else if (args.toLowerCase() === ('moderation' || 'mod')) {
      embed.addField('Moderation', '`[]` = Required Parameters.\n`<>` = Optional Parameters.')
      embed.addField('Commands', `**${process.env.PREFIX}clear [2-100]** - Cleans X messages from the same chat;`)
    }
    message.channel.send(embed)
  }
}

module.exports = Help
