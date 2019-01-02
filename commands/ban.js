const { MessageEmbed } = require('discord.js')
module.exports = {
  run: async function (message, client, args) {
    let msg = ''
    let title = 'Missing Parameters!'
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
    if (message.member.roles.highest.position !== member.roles.highest.position) {
      title = 'Denied!'
      msg = 'You can\'t manage this user because they have the same or higher role as you.'
    } else if (member.manageable) {
      title = 'Denied!'
      msg = 'I can\'t manage this user because they have the same or higher role than me.'
    } else {
      member.ban({ days: 7, reason: reason ? reason : 'No reason given' })
    }
  }
}
