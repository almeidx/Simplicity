const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class Avatar extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['av']
    this.category = 'util'
  }
  run ({ author, guild, send, args, message, t }) {
    const embed = new MessageEmbed()
    if (args.length === 0) {
      embed.setImage(author.displayAvatarURL({ size: 2048 }))
        .setAuthor(author.tag, author.displayAvatarURL({ size: 2048 }))
      return send(embed)
    }
    if (message.mentions.members.first()) {
      let mem = message.mentions.members.first()
      embed.setImage(mem.user.displayAvatarURL({ size: 2048 }))
        .setAuthor(mem.user.tag, mem.user.displayAvatarURL({ size: 2048 }))
      return send(embed)
    } else {
      this.client.users.fetch(args[0])
        .then(u => {
          embed.setImage(u.displayAvatarURL({ size: 2048 }))
            .setAuthor(u.tag, u.displayAvatarURL({ size: 2048 }))
          return send(embed)
        })
        .catch(() => {
          return send(embed, { error: true })
        })
    }
  }
}
module.exports = Avatar
