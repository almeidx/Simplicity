'use strict';

const { Command, CommandError, Parameters, SimplicityEmbed, Utils } = require('../..');
const { checkTick } = Utils;
const { ChannelParameter } = Parameters;

const Aliases = {
  memberJoin: ['join', 'joined'],
  memberLeave: ['leave', 'left'],
  MessageUpdate: ['message', 'messageedit', 'messagelogs', 'messages', 'messagedits', 'messageedits'],
  UserUpdate: ['userUpdates', 'user', 'userChanges', 'users'],
  VoiceChannelLogs: ['vc', 'voice'],
};

const logs = ['memberJoin', 'memberLeave'];
class Logs extends Command {
  constructor(client) {
    super(client, {
      name: 'logs',
      cooldown: 3000,
      aliases: ['log', 'logger', 'loggers', 'modlog', 'modlogs', 'eventlog', 'logevent'],
      category: 'bot',
      requirements: {
        requireDatabase: true,
        permissions: ['MANAGE_GUILD'],
      },
      subcommands: [
        new SetChannelSubCommand(client),
      ],
    });
  }

  run({ guildData, author, t, emoji, send }) {
    if (!guildData.logs.channelID) throw new CommandError('commands:logs.noChannel');

    const embed = new SimplicityEmbed({ author, t, emoji });

    for (const logName of logs) {
      embed.addField(`$$loggers:${logName}`, `${checkTick(guildData.logs[logName])}`, true);
    }

    send(embed);
  }
}

class SetChannelSubCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setchannel',
      subcommand: true,
      aliases: ['channel', 'set', 'schannel', 'c'],
      requirements: {
        requireDatabase: true,
        argRequired: true,
      },
      argRequireResponse: 'commands:logs-setchannel.channel',
    });
  }

  async run({ query, guildData, database, guild, message, t }) {
    const dblogs = guildData.logs;
    if (!query) {
      if (!dblogs.channelID) throw new CommandError('commands:logs-setchannel.noChannel');
      dblogs.channelID = null;
      await database.guilds.edit(guild.id, { logs: dblogs });
      return message.reply(t('commands:logs-setchannel.disable'));
    }

    const channel = await ChannelParameter.parse(query, { required: true }, { guild });

    if (channel.id === dblogs.channelID) throw new CommandError('commands:logs-setchannel.alreadyChannel');

    dblogs.channelID = channel.id;
    await database.guilds.edit(guild.id, { logs: dblogs });
    return message.reply(t('commands:logs-setchannel.success'));
  }
}

module.exports = Logs;

/**
 *     const checkChannel = (c) => guild.channels.get(c) ? c : '#TICK_NO';
    const embed = new SimplicityEmbed({ author, emoji, t });
    const { logs } = await client.database.guilds.get(guild.id);
    const logTypes = Object.keys(logs);

    const type = args.length && args.shift().toLowerCase();
    const condition = type && args.length && args.shift().toLowerCase();
    const aliasesList = [];
    const aliasesValues = Object.values(Aliases);
    for (const i in aliasesValues) aliasesValues[i].forEach((a) => aliasesList.push(a));

    if (!query) {
      for (const i of logTypes) if (i !== '$init') embed.addField(`» $$commands:logs.${i}`, checkChannel(i), true);
      return send(embed);
    } else if (aliasesList.includes(type) && condition === Condition) {
      const channel = args.length && await ChannelParameter.search(args.join(' '), { guild });
      if (!channel) throw new CommandError('errors:invalidChannel');
      if (logs[type] === channel.id) throw new CommandError('commands:logs.alreadySet');

      const data = await client.database.guilds.edit(guild.id, { logs: { type: channel.id } }).catch(() => null);
      if (!data) throw new CommandError('commands:logs.error');
      embed.setDescription('commands:logs.edited', { type, channel });
      return send(embed);
    } else return send('What? Where??');
 */
