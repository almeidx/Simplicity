const { Embed, LogUtils } = require('../')

function userUpdate (oldUser, newUser) {
  // AVATAR CHANGES
  if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
    this.guilds.filter(guild => guild.members.get(oldUser.id)).forEach(async guild => {
      const { channel, t } = await LogUtils.getChannel(this, guild, 'JOIN_AND_LEAVE')

      if (channel) {
        const embed = new Embed({ t })
          .setTimestamp()
          .setAuthor(newUser.tag, newUser.displayAvatarURL())
          .setImage(newUser.displayAvatarURL({ size: 2048 }))
          .setColor(process.env.COLOR)
          .setFooter(guild.name, guild.iconURL())
          .setDescription('loggers:changedAvatar', { user: newUser })

        LogUtils.send(channel, embed)
      }
    })
  }
}

module.exports = userUpdate
