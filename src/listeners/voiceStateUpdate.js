const { MessageEmbed } = require('discord.js')
module.exports = function voiceStateUpdate (oldState, newState) {
  const oldMember = oldState.member
  const newMember = newState.member
  const chan = oldMember.guild.channels.find(ch => ch.name === 'logs')
  if (chan) {
    let newUserChannel = oldMember.voice.channel
    let oldUserChannel = newMember.voice.channel
    const embed = new MessageEmbed()
      .setColor(process.env.COLOR)
      .setFooter(oldMember.guild.name, oldMember.guild.iconURL({ size: 2048 }))
      .setAuthor(oldMember.user.tag, oldMember.user.displayAvatarURL({ size: 2048 }))
      .setTimestamp()
    if (oldUserChannel === undefined && newUserChannel) {
      embed.setDescription(`${oldMember} has joined the voice channel: **${newUserChannel.name}**`)
      return chan.send(embed)
    } else if (oldUserChannel && newUserChannel === undefined) {
      embed.setDescription(`${oldMember} has left the voice channel: **${oldUserChannel.name}**`)
      return chan.send(embed)
    } else if (oldUserChannel !== newUserChannel) {
      embed.setDescription(`${oldMember} has moved from the voice channel **${oldUserChannel.name}** to ${newUserChannel.name}`)
      return chan.send(embed)
    }
  }
}
