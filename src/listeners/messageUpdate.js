const { MessageEmbed } = require('discord.js')
const Constants = require('../utils/Constants')
module.exports = async function messageUpdate (oldMessage, newMessage) {
  const chan = newMessage.guild.channels.find(ch => ch.name === 'logs')
  const embed = new MessageEmbed()
    .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL({ size: 2048 }))
    .setTimestamp()
    .setFooter(`ID: ${oldMessage.author.id}`, newMessage.author.displayAvatarURL({ size: 2048 }))
  if (oldMessage.channel === chan) return
  if (chan && oldMessage.guild.me.permissions.has('READ_AUDIT_LOGS')) {
    if (oldMessage.content !== newMessage.content) { // Message Edits
      embed.setDescription(`**Message by ${oldMessage.author} edited in ${oldMessage.channel}**`)
        .addField('Before', (oldMessage.content.slice(0, 1020) + oldMessage.content.length >= 1024 ? '...' : oldMessage.content) || '** **', true)
        .addField('After', (newMessage.content.slice(0, 1020) + newMessage.content.length >= 1024 ? '...' : newMessage.content) || '** **', true)
        .setColor(Constants.COLORS.MESSAGE_EDIT)
      return chan.send(embed)
    } else if ((oldMessage.pinned === true || newMessage.pinned === false) ||
              (oldMessage.pinned === false || newMessage.pinned === true)) { // Message Pins
      embed.addField('Content', newMessage.content || '** **')
      if (oldMessage.pinned && newMessage.pinned === false) {
        embed.setDescription(`**Message by ${oldMessage.author} unpinned on ${oldMessage.channel}**`)
          .setColor(Constants.COLORS.MESSAGE_UNPIN)
        return chan.send(embed)
      } else if (newMessage.pinned && oldMessage.pinned === false) {
        embed.setDescription(`**Message by ${oldMessage.author} pinned on ${oldMessage.channel}**`)
          .setColor(Constants.COLORS.MESSAGE_PIN)
        return chan.send(embed)
      }
    }
  }
}
