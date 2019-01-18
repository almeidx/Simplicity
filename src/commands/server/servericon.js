const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class ServerIcon extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['svicon']
    this.category = 'server'
  }
  run ({ author, guild, send, t }) {
    const embed = new MessageEmbed()
      .setDescription(t('commands:servericon:description'), { icon: guild.iconURL({ size: 2048 }) })
      .setImage(guild.iconURL({ size: 2048 }))
      .setFooter(`${t('utils:footer')} ${author.tag}`, author.displayAvatarURL({ size: 2048 }))
    send(embed)
  }
}
module.exports = ServerIcon
