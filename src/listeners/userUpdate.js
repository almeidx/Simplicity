const { MessageEmbed } = require('discord.js')
module.exports = async function userUpdate (oldUser, newUser) {
  if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
    const embed = new MessageEmbed()
      .setAuthor(newUser.tag, newUser.displayAvatarURL({ size: 2048 }))
      .setDescription(newUser.toString() + ' has changed their avatar.')
      .setImage(newUser.displayAvatarURL({ size: 2048 }))
      .setColor(process.env.COLOR)
      .setTimestamp()
    this.guilds.forEach(g => {
      if (g.members.find(mem => mem.id === oldUser.id)) {
        const chan = g.channels.find(ch => ch.name === 'logs')
        embed.setFooter(g.name, g.iconURL({ size: 2048 }))
        if (chan) {
          chan.send(embed)
            .catch(() => {})
        }
      }
    })
  }
}
