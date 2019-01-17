const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class Avatar extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['av']
    this.category = 'util'
  }
  run ({ message, args }) {
    let embed = new MessageEmbed()
      .setColor(process.env.COLOR)
      .setFooter(message.author.tag, message.author.displayAvatarURL({ size: 2048 }))
    if (args.length === 0) {
      embed.setImage(message.author.displayAvatarURL({ size: 2048 }))
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 2048 }))
      return message.channel.send(embed)
    }
    if (message.mentions.members.first()) {
      let mem = message.mentions.members.first()
      embed.setImage(mem.user.displayAvatarURL({ size: 2048 }))
        .setAuthor(mem.user.tag, mem.user.displayAvatarURL({ size: 2048 }))
      return message.channel.send(embed)
    } else {
      this.client.users.fetch(args[0])
        .then(u => {
          embed.setImage(u.displayAvatarURL({ size: 2048 }))
            .setAuthor(u.tag, u.displayAvatarURL({ size: 2048 }))
          return message.channel.send(embed)
        })
        .catch(() => {
          embed.setTitle('Something wen\'t wrong')
          return message.channel.send(embed)
        })
    }
  }
}

module.exports = Avatar
