const { Listener, SimplicityEmbed } = require('../../')

class UserUpdate extends Listener {
  constructor (client) {
    super(client)
  }

  async on (client, oldUser, newUser) {
    const { t } = await client.database.guilds.get(oldUser.guild.id)
  // AVATAR CHANGES
    if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
      client.guilds.filter(guild => guild.members.get(oldUser.id)).forEach(guild => {
        this.sendMessage('channel_log_start',
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
