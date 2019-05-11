const { Command, CommandError, Parameters, SimplicityEmbed } = require('../..')
const { ChannelParameter } = Parameters

const Aliases = {
  GuildMemberAdd: [ 'welcome', 'join', 'joined', 'welcomer' ],
  GuildMemberLeave: [ 'leave', 'left' ],
  MessageUpdate: [ 'message', 'messageUpdates', 'messageLogs', 'messages' ],
  UserUpdate: [ 'userUpdates', 'user', 'userChanges', 'users' ],
  VoiceChannelLogs: [ 'vc', 'voice' ]
}
const Condition = 'set'

class Logs extends Command {
  constructor (client) {
    super(client)
    this.name = 'language'
    this.aliases = [ 'log', 'logger', 'loggers', 'modlog', 'modlogs', 'eventlog', 'logevent' ]
    this.category = 'bot'
    this.requirements = {
      ownerOnly: true,
      permissions: ['MANAGE_GUILD'] }
  }

  async run ({ args, author, client, emoji, guild, query, send, t }) {
    const checkChannel = (c) => guild.channels.get(c) ? c : '#TICK_NO'
    const embed = new SimplicityEmbed({ author, emoji, t })
    const { logs } = await client.database.guilds.get(guild.id)
    const logTypes = Object.keys(logs)

    const type = args.length && args.shift().toLowerCase()
    const condition = type && args.length && args.shift().toLowerCase()

    if (!query) {
      for (const i of logTypes)
        if (i !== '$init')
          embed.addField(`» $$commands:logs.${i}`, checkChannel(i), true)
      return send(embed)
    } else if (Object.keys(Aliases).includes(type) && condition === Condition) {
      const channel = args.length && await ChannelParameter.search(args.join(' '), { guild })
      if (!channel)
        throw new CommandError('errors:invalidChannel')
      if (logs[type] === channel.id)
        throw new CommandError('commands:logs.alreadySet')

      const data = await client.database.guilds.edit(guild.id, {
        logs: { MessageUpdates: channel.id }
      }).catch(() => null)
      if (!data)
        throw new CommandError('commands:logs.error')
      embed.setDescription('commands:logs.editedMessageUpdates', { channel })
      return send(embed)
    }
  }
}

module.exports = Logs
