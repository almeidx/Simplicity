const { Embed, Listener } = require('../..')

class Ready extends Listener {
  constructor (client) {
    super(client)
  }

  on (client) {
    client.logger.success('Ready', `Logged on ${client.guilds.size} guilds and ${client.users.size} users`)

    client.user.setActivity(`@${client.user.username} help | ${client.guilds.size} guilds | ${client.users.size} users`).catch(e => console.error(e))
    this.sendMessage('channel_log_start',
      new Embed()
        .setDescription(`Logged on ${client.guilds.size} guilds with ${client.users.size} users`)
        .setTimestamp()
        .setColor('GREEN')
        .setFooter(client.user.tag, client.user.displayAvatarURL()))
  }
}

module.exports = Ready
