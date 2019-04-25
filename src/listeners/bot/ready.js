const { SimplicityEmbed, SimplicityListener } = require('../..')

class Ready extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (client) {
    client.logger.success('Ready', `Logged on ${client.guilds.size} guilds and ${client.users.size} users`)
    client.user.setActivity(`@${client.user.username} help`, { type: 'WATCHING' }).catch(() => null)

    this.sendPrivateMessage('bot_log',
      new SimplicityEmbed()
        .setTimestamp()
        .setColor('GREEN')
        .setDescription(`Logged on ${client.guilds.size} guilds with ${client.users.size} users`)
        .setFooter(client.user.tag)
        .setAuthor(client.user.tag, client.user.displayAvatarURL()))
  }
}

module.exports = Ready
