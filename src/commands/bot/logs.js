const { Command, Parameters, SimplicityEmbed } = require('../..')
const { ChannelParameter } = Parameters

const messageUpdateAliases = [
  'message',
  'messageUpdates',
  'messageLogs',
  'messages'
]
const userUpdatesAliases = [
  'userUpdates',
  'user',
  'userChanges',
  'users'
]

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

    const type = args[0] && args.shift().toLowerCase()

    if (!query) {
      for (const i of logTypes)
        if (i !== '$init')
          embed.addField(`» $$commands:logs.${i}`, checkChannel(i), true)
      return send(embed)
    } else if (messageUpdateAliases.includes(type)) {
      const channel = await ChannelParameter.search(args.join(' '), { guild })
      if (!channel)
        throw new CommandError('errors:invalidChannel')
      if (logs.MessageUpdates === channel.id)
        throw new CommandError('commands:logs.alreadySet')

      const data = await client.database.guilds.edit(guild.id, {
        logs: { MessageUpdates: null }
      }).catch(() => null)
      if (!data)
        throw new CommandError('commands:logs.error')
      embed.setDescription('commands:logs.editedMessageUpdates', { channel })
      return send(embed)
    }
  }
}

module.exports = Logs
