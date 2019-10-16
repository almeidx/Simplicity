'use strict';

const { Command, CommandError, Parameters: { ChannelParameter }, Utils: { isEmpty } } = require('../../');

class Disable extends Command {
  constructor(client) {
    super(client, {
      name: 'disable',
      aliases: ['disablecommands', 'disablecommand', 'disablecmd', 'cmddisable', 'cmddisable'],
      category: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      requireDatabase: true,
    });
  }

  // eslint-disable-next-line complexity
  async run({ args, channel, database, guild, guildData, query, t, prefix }) {
    const disableChannels = guildData.disableChannels || [];
    let msg;

    // current channel
    if (!query) {
      const disable = this.checkChannelAndEdit(disableChannels, channel.id);
      msg = t(`commands:disable.${disable ? 'currentDisable' : 'currentEnabled'}`);
    }

    // one argument
    if (args.length === 1) {
      const argChannel = await ChannelParameter.parse(args[0], {}, { guild });
      const disable = this.checkChannelAndEdit(disableChannels, argChannel.id);
      msg = t(`commands:disable.${disable ? 'channelDisable' : 'channelEnabled'}`, { channel: argChannel.toString() });
    }

    // multi arguments
    if (args.length > 1) {
      const channels = await Promise.all(args.map((str) => ChannelParameter.search(str, { guild })));
      const channelsParsed = channels.filter((e) => e);

      if (isEmpty(channelsParsed) && !isEmpty(args)) throw new CommandError('commands:disable.notFound');

      let newChannels = [], removedChannels = [];

      for (const c of channelsParsed) {
        const result = this.checkChannelAndEdit(disableChannels, c.id);
        if (result) newChannels.push(c.toString());
        else removedChannels.push(c.toString());
      }

      if (newChannels.length && removedChannels.length) {
        msg = t('commands:disable.multiChannels', { prefix, removedChannels, newChannels });
      } else if (newChannels.length > 1 && removedChannels.length === 0) {
        msg = t('commands:disable.channelDisable', { channels: newChannels, count: newChannels.length });
      } else if (newChannels.length === 1 && removedChannels.length === 0) {
        msg = t(`commands:disable.channelDisable`, { channel: newChannels[0].toString() });
      } else if (removedChannels.length > 1 && newChannels.length === 0) {
        msg = msg = t('commands:disable.channelEnabled', { channels: removedChannels, count: removedChannels.length });
      } else if (removedChannels.length === 1 && newChannels.length === 0) {
        msg = t(`commands:disable.channelEnabled`, { channel: removedChannels[0].toString() });
      }
    }

    await database.guilds.edit(guild.id, {
      disableChannels,
    });
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
