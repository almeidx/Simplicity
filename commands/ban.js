const { MessageEmbed } = require('discord.js')
module.exports = {
  run: async function (message, client, args) {
    let msg = ''
    let title = 'Missing Parameters!'
    let color = 'RED'
    let member = message.mentions.members.first() || message.guild.members.get(args[0])
    let reason = args
    if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
      msg = 'I require the **Ban Members** permission to execute this command.'
    } else if (!message.member.permissions.has('BAN_MEMBERS')) {
      msg = 'You need **Ban Members** permission to execute this command.'
    } else if (args.length === 0) {
      msg = `Usage: **${process.env.PREFIX}ban [@mention/id] <reason>**`
    } else if (!member) {
      msg = `Usage: **${process.env.PREFIX}ban [@mention/id] <reason>**`
      title = 'You didn\'t mention / used a valid ID!'
    }
    const embed = new MessageEmbed()
    if (message.member.roles.highest.position !== member.roles.highest.position) {
      title = 'Denied!'
      msg = 'You can\'t manage this user because they have the same or higher role as you.'
    } else if (member.manageable) {
      title = 'Denied!'
      msg = 'I can\'t manage this user because they have the same or higher role than me.'
    } else {
      member.ban({ days: 7, reason: reason || 'No reason given.' })
      title = 'Member Banned'
      msg = `${member} has been banned from the server`
      embed.addField('Banned by:', message.author, true)
      embed.addField(`Reason: ` + reason || 'No reason given.')
    }
    embed.setTitle(title)
    embed.setDescription(msg)
    embed.setAuthor(message.author.username, message.author.displayAvatarURL({ size: 2048 }))
    embed.setThumbnail(message.author.displayAvatarURL)
    embed.setTimestamp()
    embed.setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
    embed.setColor(color)
    message.channel.send({ embed: embed })
  }
}
