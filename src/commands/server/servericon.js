const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class ServerIcon extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['svicon']
    this.category = 'server'
  }
  run ({ message }) {
    let embed = new MessageEmbed()
      .setDescription(`Click [here](${message.guild.iconURL({ size: 2048 })}) to download the icon!`)
      .setImage(message.guild.iconURL({ size: 2048 }))
      .setColor(process.env.COLOR)
      .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
    message.channel.send(embed)
  }
}

module.exports = ServerIcon
