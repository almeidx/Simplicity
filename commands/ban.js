const { MessageEmbed } = require('discord.js')

function getUser (message, [query = null]) {
  let member = message.mentions.members.first()
  let checkMention = new RegExp('(^<@[0-9]*>)', 'g').test(query)
  if (member && checkMention) {
    return member
  }
  member = message.guild.member(query)
  if (member) {
    return member
  }
}

module.exports = {
  run: async function (message, client, args) {
    const embed = new MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({ size: 2048 }))
      .setTimestamp()
      .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
      .setColor('RED')
    // eslint-disable-next-line one-var
    let msg, title = 'Missing Parameters!'
    let member = getUser(message, args)
    let reason = args.slice(1).join(' ')

    if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
      msg = 'I require the **Ban Members** permission to execute this command.'

    } else if (!message.member.permissions.has('BAN_MEMBERS')) {
      msg = 'You need **Ban Members** permission to execute this command.'

    } else if (args.length === 0) {
      msg = `Usage: **${process.env.PREFIX}ban [@mention/id] <reason>**`

    } else if (!member) {
      msg = `Usage: **${process.env.PREFIX}ban [@mention/id] <reason>**`
      title = 'You didn\'t mention / used a valid ID!'
    } else if (message.member.roles.highest.position <= member.roles.highest.position) {
      title = 'Denied!'
      msg = 'You can\'t ban this user because they have the same or higher role as you.'
    } else if (message.guild.me.roles.highest.position <= member.roles.highest.position) {
      title = 'Denied!'
      msg = 'I can\'t ban this user because they have the same or higher role as me.'
    } else {
      member.ban({ days: 7, reason: reason || 'No reason given.' })
      title = 'Member Banned'
      msg = `${member} has been banned from the server`
      embed.addField('Banned by:', message.author, true)
        // eslint-disable-next-line no-unneeded-ternary
        .addField(`Reason: `, reason ? reason : 'No reason given.')
        .setThumbnail(message.author.displayAvatarURL())
    }

    embed.setDescription(msg)
    embed.setTitle(title)
    message.channel.send(embed)
  }
}
