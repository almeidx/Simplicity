'use strict';

const { EMOJIS: { STARBOARD } } = require('./Constants');

async function handleStarboard(client, reaction, user) {
  if (STARBOARD === reaction.emoji.name) return;

  const guildData = client.database && await client.database.guilds.get(reaction.message.guild.id);
  const channelId = guildData && guildData.starboardChannel;
  const channel = channelId && reaction.message.channel.guild.channels.get(channelId);

}

module.exports = handleStarboard;
