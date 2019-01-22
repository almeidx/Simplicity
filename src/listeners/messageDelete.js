const { MessageEmbed } = require('discord.js')
module.exports = async function messageDelete (message) {
  const chan = message.guild.channels.find(ch => ch.name === 'logs')
  if (message.channel === chan) return
  if (chan) {
    if (message.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
      const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => audit.entries.first())
      let user
      if (entry.extra.channel.id === message.channel.id && entry.target.id === message.author.id && entry.createdTimestamp > Date.now() - 5000) {
        user = entry.executor
      } else {
        user = message.author
      }
      let embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 2048 }))
        .setDescription(`**Message sent by ${message.author} deleted in ${message.channel} by ${user}**`)
        .addField('Content', (message.content.slice(0, 1020) + message.content.length >= 1024 ? ' ...' : message.content) || 'An error occurred while inputting the message content.')
        .setFooter(`ID: ${message.author.id}`, message.author.displayAvatarURL({ size: 2048 }))
        .setTimestamp()
        .setColor(process.env.COLOR)
      chan.send(embed)
    }
  }
}
