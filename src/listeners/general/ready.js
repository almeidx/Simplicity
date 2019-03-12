const { Embed, Listener } = require('../..')

class Ready extends Listener {
  constructor (client) {
    super(client)
  }

  on (client) {
    client.logger.success('Ready', `Logged on ${client.guilds.size} guilds and ${client.users.size} users`)

    client.user.setActivity(`@${client.user.username} Logged on ${client.guilds.size} guilds and ${client.users.size} users`)
    this.sendMessage('channel_log_start',
      new Embed()
        .setDescription(`Logged on ${client.guilds.size} guilds with ${client.users.size} users`)
        .setTimestamp()
        .setColor('GREEN')
        .setFooter(client.user.tag, client.user.displayAvatarURL()))
  }
}

module.exports = Ready
