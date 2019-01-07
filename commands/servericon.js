const { MessageEmbed } = require('discord.js')
const Command = require('../structures/Command')

class ServerIcon extends Command {
  constructor (name, client) {
    super(name, client)
    this.aliases = ['svicon']
    this.description = 'This command shows the server icon.'
    this.usage = `Usage: **${process.env.PREFIX}servericon**`
    this.category = 'Server'
    this.argsRequired = false
  }
  run (message, args) {
    let embed = new MessageEmbed()
      .setDescription(`Click [here](${message.guild.iconURL({ size: 2048 })}) to download the icon!`)
      .setImage(message.guild.iconURL({ size: 2048 }))
      .setColor('#0494bc')
      .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
    message.channel.send(embed)
  }
}

module.exports = ServerIcon
