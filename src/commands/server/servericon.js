const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class ServerIcon extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['svicon']
    this.category = 'server'
  }
  run ({ author, guild, send, t }) {
    const url = guild.iconURL({ size: 2048 })
    let embed = new MessageEmbed()
      .setDescription(t('commands:servericon:description'), { icon: url })
      .setImage(guild.iconURL({ size: 2048 }))
      .setColor(process.env.COLOR)
      .setFooter(`${t('utils:footer')} ${author.tag}`, author.displayAvatarURL({ size: 2048 }))
    send(embed)
  }
}

module.exports = ServerIcon
