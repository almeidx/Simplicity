const { SimplicityListener, SimplicityEmbed, Utils } = require('../../')

class UserUpdate extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  async on (client, oldUser, newUser) {
  // AVATAR CHANGES
    if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
      client.guilds.filter((g) => g.members.get(oldUser.id)).forEach((guild) => {
        this.sendLogMessage(guild.id, 'UserAvatarChange',
          new SimplicityEmbed(this.getFixedT(guild.id))
            .setTimestamp()
            .setAuthor(newUser.tag, newUser.displayAvatarURL())
            .setImage(newUser.displayAvatarURL({ size: 2048 }))
            .setColor(process.env.COLOR)
            .setFooter(guild.name, Utils.getServerIconURL(guild))
            .setDescription('loggers:changedAvatar', { user: newUser })).catch(() => null)
      })
    }
  }
}

module.exports = UserUpdate
