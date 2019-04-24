const { SimplicityListener, SimplicityEmbed } = require('../../')

class UserUpdate extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (client, oldUser, newUser, t) { // t
  // AVATAR CHANGES
    if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
      client.guilds.filter(guild => guild.members.get(oldUser.id)).forEach(guild => {
        this.sendMessage('channel_log_start', // falta adicionar o coiso no Listener.js para a database
          new SimplicityEmbed({ t })
            .setTimestamp()
            .setAuthor(newUser.tag, newUser.displayAvatarURL())
            .setImage(newUser.displayAvatarURL({ size: 2048 }))
            .setColor(process.env.COLOR)
            .setFooter(guild.name, guild.iconURL())
            .setDescription('loggers:changedAvatar', { user: newUser })
        )
      })
    }
  }
}

module.exports = UserUpdate
