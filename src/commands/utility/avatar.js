const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class Avatar extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['googletranslate', 'google-translate']
    this.category = 'utility'
  }
  run ({ message, args }) {
    let embed = new MessageEmbed()
    if (message.mentions.members) {
      embed.setImage(message.mentions.members.first().displayAvatarURL({ size: 2048 }))
    } else {
      try {
        this.client.users.fetch(args[0]) // nem aq
      } catch (err) {
        embed.setTitle('Something wen\'t wrong') // calma ainda n terminei
      }
    }
    message.channel.send(embed)
  }
}

module.exports = Avatar
