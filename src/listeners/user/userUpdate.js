'use strict';

const { SimplicityListener, SimplicityEmbed, Utils } = require('../../');

class UserUpdate extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(client, oldUser, newUser) {
    // AVATAR CHANGES
    if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) client.guilds
      .filter((g) => g.members.get(oldUser.id)).forEach((guild) => {
        this.sendLogMessage(guild.id, 'UserUpdate',
          new SimplicityEmbed(this.getFixedT(guild.id))
            .setTimestamp()
            .setAuthor(newUser.tag, newUser.displayAvatarURL())
            .setImage(newUser.displayAvatarURL({ size: 2048 }))
            .setColor(process.env.COLOR)
            .setFooter(guild.name, Utils.getServerIconURL(guild))
            .setDescription('loggers:changedAvatar', { user: newUser })).catch(() => null);
      });
    else if (oldUser.username !== newUser.username) client.guilds
      .filter((g) => g.members.get(oldUser.id)).forEach((guild) => {
        this.sendLogMessage(guild.id, 'UserUpdate',
          new SimplicityEmbed(this.getFixedT(guild.id))
            .setTimestamp()
            .setAuthor(newUser.tag, newUser.displayAvatarURL())
            .setColor(process.env.COLOR)
            .setThumbnail(oldUser.displayAvatarURL())
            .setFooter(guild.name, Utils.getServerIconURL(guild))
            .setDescription('loggers:changedUsername', { user: newUser })
            .addField('loggers:before', oldUser.username, true)
            .addField('loggers:after', newUser.username, true)).catch(() => null);
      });
    else if (oldUser.discriminator !== newUser.discriminator) client.guilds
      .filter((g) => g.members.get(oldUser.id)).forEach((guild) => {
        this.sendLogMessage(guild.id, 'UserUpdate',
          new SimplicityEmbed(this.getFixedT(guild.id))
            .setTimestamp()
            .setAuthor(newUser.tag, newUser.displayAvatarURL())
            .setColor(process.env.COLOR)
            .setThumbnail(oldUser.displayAvatarURL())
            .setFooter(guild.name, Utils.getServerIconURL(guild))
            .setDescription('loggers:changedDiscriminator', { user: newUser })
            .addField('loggers:before', oldUser.discriminator, true)
            .addField('loggers:after', newUser.discriminator, true)).catch(() => null);
      });
  }
}

module.exports = UserUpdate;
