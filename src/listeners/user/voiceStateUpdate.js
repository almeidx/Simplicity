'use strict';

const { SimplicityListener, SimplicityEmbed } = require('../../index');

class VoiceStateUpdate extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(_, oldState, newState) {
    const user = oldState.member.user;
    const guild = oldState.member.guild;
    const oldChannel = oldState.channel && `**${oldState.channel.name}**`;
    const newChannel = newState.channel && `**${newState.channel.name}**`;

    const embed = new SimplicityEmbed(this.getFixedT(guild.id))
      .setTimestamp()
      .setAuthor(user.tag, user.displayAvatarURL())
      .setFooter('loggers:id', '', { id: user.id });

    // LEAVE CHANNEL
    if (oldChannel && !newChannel) {
      embed.setDescription('loggers:leaveVoiceChannel', { user, channel: oldChannel });
      return this.sendLogMessage(guild.id, 'VoiceChannelLogs', embed).catch(() => null);
    } else
    // JOIN CHANNEL
    if (!oldChannel && newChannel) {
      embed.setDescription('loggers:joinVoiceChannel', { user, channel: newChannel });
      return this.sendLogMessage(guild.id, 'VoiceChannelLogs', embed).catch(() => null);
    } else {
    // MOVED CHANNEL
      embed.setDescription('loggers:hasChangedVoiceChannel', { user, newChannel, oldChannel });
      return this.sendLogMessage(guild.id, 'VoiceChannelLogs', embed).catch(() => null);
    }
  }
}

module.exports = VoiceStateUpdate;
