const { MessageEmbed } = require('discord.js')
const Constants = require('../utils/Constants')
module.exports = function messageDeleteBulk (messages) {
  const chan = messages.first().guild.channels.find(ch => ch.name === 'logs')
  if (chan) {
    const embed = new MessageEmbed()
      .setAuthor(messages.first().guild.name, messages.first().guild.iconURL({ size: 2048 }))
      .setDescription(`**${messages.size} messages Bulk Deleted in ${messages.first().channel}**`)
      .setTimestamp()
      .setColor(Constants.COLORS.MESSAGE_DELETE)
    chan.send(embed)
  }
}
