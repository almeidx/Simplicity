'use strict';

const Arguments = require('@arguments');
const { Command, CommandError } = require('@structures');
const { isEmpty } = require('@util/Util');

class Disable extends Command {
  constructor(client) {
    super(client, 'disable', {
      aliases: ['disablecommands', 'disablecommand', 'disablecmd', 'cmddisable'],
      category: 'module',
      requirements: { permissions: ['MANAGE_GUILD'], requireDatabase: true },
    });
  }

  // eslint-disable-next-line complexity
  async run({ args, channel, database, guild, guildData, query, t, prefix, client, member }) {
    const disableChannels = guildData.disableChannels || [];
    let msg;

    // Current channel
    if (!query) {
      const disable = this.checkChannelAndEdit(disableChannels, channel.id);
      msg = t(`commands:disable.${disable ? 'currentDisable' : 'currentEnabled'}`);
    }

    const parameterOptions = { acceptText: true, required: true };
    const parameterContext = { client, guild, member, t };
    // One argument
    if (args.length === 1) {
      const argChannel = await Arguments.channel.parse.call(parameterOptions, args[0], parameterContext);
      const disable = this.checkChannelAndEdit(disableChannels, argChannel.id);
      msg = t(`commands:disable.${disable ? 'channelDisable' : 'channelEnabled'}`, { channel: `${argChannel}` });
    }

    // Multi arguments
    if (args.length > 1) {
      const channels = await Promise.all(
        args.map((str) => Arguments.channel.parse.call(parameterOptions, str, parameterContext)),
      );
      const channelsParsed = channels.filter((e) => e);

      if (isEmpty(channelsParsed) && !isEmpty(args)) throw new CommandError('commands:disable.notFound');

      const newChannels = []; const removedChannels = [];

      for (const c of channelsParsed) {
        const result = this.checkChannelAndEdit(disableChannels, c.id);
        if (result) newChannels.push(`${c}`);
        else removedChannels.push(`${c}`);
      }

      if (newChannels.length && removedChannels.length) {
        msg = t('commands:disable.multiChannels', { newChannels, prefix, removedChannels });
      } else if (newChannels.length > 1 && removedChannels.length === 0) {
        msg = t('commands:disable.channelDisable', { channels: newChannels, count: newChannels.length });
      } else if (newChannels.length === 1 && removedChannels.length === 0) {
        msg = t(`commands:disable.channelDisable`, { channel: `${newChannels[0]}` });
      } else if (removedChannels.length > 1 && newChannels.length === 0) {
        msg = t('commands:disable.channelEnabled', { channels: removedChannels, count: removedChannels.length });
      } else if (removedChannels.length === 1 && newChannels.length === 0) {
        msg = t(`commands:disable.channelEnabled`, { channel: `${removedChannels[0]}` });
      }
    }

    await database.guilds.edit(guild.id, { disableChannels });
    channel.send(msg);
  }

  checkChannelAndEdit(disableChannels, channelId) {
    let result = true;
    if (disableChannels.includes(channelId)) {
      result = false;
      delete disableChannels[disableChannels.indexOf(channelId)];
    } else disableChannels.push(channelId);
    return result;
  }
}

module.exports = Disable;
