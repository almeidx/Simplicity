const { MessageEmbed } = require('discord.js')
module.exports = async function messageUpdate (oldMessage, newMessage) {
  const chan = newMessage.guild.channels.find(ch => ch.name === 'logs')
  if (oldMessage.channel === chan) return
  if (chan) {
    if (oldMessage.content !== newMessage.content) { // Message Edits
      let embed = new MessageEmbed()
        .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL({ size: 2048 }))
        .setDescription(`**Message by ${oldMessage.author} edited in ${oldMessage.channel}**`)
        .addField('Before', oldMessage.content.slice(0, 1020) + oldMessage.content.length >= 1024 ? '...' : oldMessage.content, true)
        .addField('After', newMessage.content.slice(0, 1020) + newMessage.content.length >= 1024 ? '...' : newMessage.content, true)
        .setColor(process.env.COLOR)
        .setTimestamp()
        .setFooter(`ID: ${oldMessage.author.id}`, newMessage.author.displayAvatarURL({ size: 2048 }))
      return chan.send(embed)
    } else if ((oldMessage.pinned === true || newMessage.pinned === false) ||
              (oldMessage.pinned === false || newMessage.pinned === true)) { // Message Pins
      let embed = new MessageEmbed()
        .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL({ size: 2048 }))
        .addField('Content', newMessage.content || 'None')
        .setColor(process.env.COLOR)
        .setTimestamp()
        .setFooter(`ID: ${oldMessage.author.id}`, newMessage.author.displayAvatarURL({ size: 2048 }))
      if (oldMessage.pinned && newMessage.pinned === false) {
        embed.setDescription(`**Message by ${oldMessage.author} unpinned on ${oldMessage.channel}**`)
        return chan.send(embed)
      } else if (newMessage.pinned && oldMessage.pinned === false) {
        embed.setDescription(`**Message by ${oldMessage.author} pinned on ${oldMessage.channel}**`)
        return chan.send(embed)
      }
    }
  }
}
