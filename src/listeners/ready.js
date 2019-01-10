const { MessageEmbed } = require('discord.js')
module.exports = function Ready () {
  console.log(`Logged on ${this.guilds.size} guilds, ${this.users.size} users at ${require('moment')().format('LLLL')}`)
  this.user.setActivity(`@Simplicity help | ${this.users.size} users`, { type: 'WATCHING' })
  const embed = new MessageEmbed()
    .setTitle('**Bot has started**')
    .setDescription(`Logged on **${this.guilds.size} guilds**, **${this.users.size} users** at: \`${require('moment')().format('LLLL')}\``)
    .setTimestamp()
    .setColor('014686')
    .setFooter(this.user.username, this.user.displayAvatarURL({ size: 2048 }))
  this.channels.get('532374004791640064').send(embed)
}
