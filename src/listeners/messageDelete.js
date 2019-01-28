const { MessageEmbed } = require('discord.js')
module.exports = async function messageDelete (message) {
  const chan = message.guild.channels.find(ch => ch.name === 'logs')
  if (message.channel === chan) return
  if (chan) {
    const embed = new MessageEmbed()
      .addField('Content', (message.content.slice(0, 1020) + message.content.length >= 1024 ? ' ...' : message.content) || '** **')
      .setDescription(`**Message sent by ${message.author} deleted in ${message.channel}**`)
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 2048 }))
      .setFooter(`ID: ${message.author.id}`, message.author.displayAvatarURL({ size: 2048 }))
      .setColor(process.env.COLOR)
      .setTimestamp()
    if (message.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
      const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => audit.entries.first())
      if (entry.extra.channel.id === message.channel.id && entry.target.id === message.author.id && entry.createdTimestamp > Date.now() - 5000) {
        const user = entry.executor
        embed.setDescription(`**Message sent by ${message.author} deleted in ${message.channel} by ${user}**`)
      }
    }
    chan.send(embed)
  }
}
