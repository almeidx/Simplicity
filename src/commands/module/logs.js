'use strict';

const Parameters = require('@parameters');
const { Command, CommandError, SimplicityEmbed } = require('@structures');

const Aliases = {
  GuildMemberAdd: ['welcome', 'join', 'joined', 'welcoming'],
  GuildMemberLeave: ['leave', 'left'],
  MessageUpdate: ['message', 'messageUpdates', 'messageLogs', 'messages'],
  UserUpdate: ['userUpdates', 'user', 'userChanges', 'users'],
  VoiceChannelLogs: ['vc', 'voice'],
};
const Condition = 'set';

class Logs extends Command {
  constructor(client) {
    super(client, {
      aliases: ['log', 'logger', 'loggers', 'modlog', 'modlogs', 'eventlog', 'logevent'],
      category: 'module',
      cooldown: 60000,
      name: 'logs',
      requirements: {
        ownerOnly: true,
        permissions: ['MANAGE_GUILD'],
        requireDatabase: true,
      },
    });
  }

  async run({ args, author, client, emoji, guild, query, send, t, member }) {
    const checkChannel = (c) => guild.channels.cache.get(c) ? c : '#TICK_NO';
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
      const channel = args.length && await Parameters.channel.parse(args.join(' '), { client, guild, member, t });
      if (!channel) throw new CommandError('errors:invalidChannel');
      if (logs[type] === channel.id) throw new CommandError('commands:logs.alreadySet');

      const data = await client.database.guilds.edit(guild.id, { logs: { type: channel.id } }).catch(() => null);
      if (!data) throw new CommandError('commands:logs.error');
      embed.setDescription('commands:logs.edited', { channel, type });
      return send(embed);
    } else return send('What? Where??');
  }
}

module.exports = Logs;
