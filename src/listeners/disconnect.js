const { MessageEmbed } = require('discord.js')
module.exports = function Disconnect () {
  console.log(`The bot has been disconnected at ${require('moment')().format('LLLL')}`)
  const embed = new MessageEmbed()
    .setTitle('**Bot has disconnected**')
    .setDescription(`Disconnected at: \`${require('moment')().format('LLLL')}\``)
    .setTimestamp()
    .setColor('RED')
    .setFooter(this.user.username, this.user.displayAvatarURL())

  if (process.env.BOT_LOG && this.channels.has(process.env.BOT_LOG)) {
    this.channels.get(process.env.BOT_LOG).send(embed)
  }
}
