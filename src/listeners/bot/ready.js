const { SimplicityEmbed, SimplicityListener } = require('../..')

class Ready extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (client) {
    client.logger.success('Ready', `Logged on ${client.guilds.size} guilds and ${client.users.size} users`)

    client.user.setActivity(`@${client.user.username} help`, { type: 'WATCHING' }).catch((e) => console.error(e))
    this.sendMessage('channel_log_start',
      new SimplicityEmbed()
        .setDescription(`Logged on ${client.guilds.size} guilds with ${client.users.size} users`)
        .setTimestamp()
        .setColor('GREEN')
        .setFooter(client.user.tag, client.user.displayAvatarURL())).catch((e) => console.error(e))
  }
}

module.exports = Ready
