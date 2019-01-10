const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class Prefix extends Command {
  constructor (client) {
    super(client)
    this.description = 'This command sets my prefix on the server the command was used!.'
    this.usage = `Usage: **${process.env.PREFIX}prefix [prefix]**`
    this.category = 'Bot'
    this.argsRequired = true
    this.permissions = ['MANAGE_GUILD']
  }

  run (message, args) {
    let pfx = args.join('')
    if (pfx.length >= 10) {
      let embed = new MessageEmbed()
        .setTitle('Denied!')
        .setDescription('My new prefix can\'t have more than 10 characters!')
        .setColor('RED')
        .setAuthor(message.author.username, message.author.displayAvatarURL({ size: 2048 }))
        .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
      return message.channel.send(embed)
    }
    this.client.Database.guilds.edit(message.guild.id, { prefix: pfx })
      .catch(() => {
        let embed = new MessageEmbed()
          .setTitle('Oops!')
          .setDescription('Sadly, something wen\'t wrong while trying to update the servers prefix!\nPlease, try again later.')
          .setColor('RED')
          .setAuthor(message.author.username, message.author.displayAvatarURL({ size: 2048 }))
          .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
        return message.channel.send(embed)
      })
    let embed = new MessageEmbed()
      .setTitle('Done!')
      .setDescription(`My prefix on this server has been changed to: \`${pfx}\``)
      .setColor(process.env.COLOR)
      .setAuthor(message.author.username, message.author.displayAvatarURL({ size: 2048 }))
      .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
    return message.channel.send(embed)
  }
}

module.exports = Prefix
