const { MessageEmbed } = require('discord.js')
module.exports = async function messageUpdate (oldMessage, newMessage) {
  const chan = newMessage.guild.channels.find(ch => ch.name === 'logs')
  if (oldMessage.content === newMessage.content || oldMessage.channel === chan) return
  if (chan) {
    const oldContent = oldMessage.content.length >= 1024 ? `${oldMessage.content.slice(0, 1020)}...` : oldMessage.content
    const newContent = newMessage.content.length >= 1024 ? `${newMessage.content.slice(0, 1020)}...` : newMessage.content
    let embed = new MessageEmbed()
      .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL({ size: 2048 }))
      .setDescription(`**Message by ${oldMessage.author} edited in ${oldMessage.channel}**`)
      .addField('Before', oldContent, true)
      .addField('After', newContent, true)
      .setColor(process.env.COLOR)
      .setTimestamp()
      .setFooter(`ID: ${oldMessage.author.id}`, newMessage.author.displayAvatarURL({ size: 2048 }))
    chan.send(embed)
  }
}
