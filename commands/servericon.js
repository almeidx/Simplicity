const { MessageEmbed } = require('discord.js')
module.exports = {
  run: async function (message, client) {
    let embed = new MessageEmbed()
      .setDescription(`Click [here](${message.guild.iconURL({ size: 2048 })}) to download the icon!`)
      .setImage(message.guild.iconURL({ size: 2048 }))
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL)
    message.channel.send(embed)
  },
  aliases: ['svicon']
}
