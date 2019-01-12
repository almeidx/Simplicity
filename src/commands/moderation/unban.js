const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class Unban extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ub']
    this.description = 'This command lets you unban members from your server.'
    this.usage = `Usage: **${process.env.PREFIX}unban [id] <reason>**`
    this.category = 'Moderation'
    this.argsRequired = true
    this.permissions = ['BAN_MEMBERS']
    this.clientPermissions = ['BAN_MEMBERS']
  }

  run (message, args) {
    const embed = new MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({ size: 2048 }))
      .setTimestamp()
      .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
      .setColor('RED')
    let reason = args.slice(1)
    let title = 'Something wen\'t wrong!'
    let msg
    if (args[0].match('(^[0-9]*$)')) {
      try {
        this.client.users.fetch(args[0]).then(u => {
          message.guild.members.unban(args[0], { reason: (reason ? message.author.tag + ' | ' + reason : message.author.tag + ' | No reason provided.') })
          title = 'Member Unbanned'
          msg = `${u.user.tag} has been unbanned from the server!`
          embed.addField('Unbanned by:', message.author, true)
            .addField('Reason:', reason || 'No reason provided.')
            .setColor('0494bc')
            .setThumbnail(u.user.displayAvatarURL({ size: 2048 }))
        })
      } catch (err) {
        msg = 'I was unable to find a user with that ID!'
      }
    } else {
      msg = 'You have provided a wrong ID!'
    }
    embed.setTitle(title)
      .setDescription(msg)
    message.channel.send(embed)
  }
}

module.exports = Unban
