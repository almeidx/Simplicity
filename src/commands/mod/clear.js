const { Command, CommandError, SimplicityEmbed } = require('../../')

class Clear extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['purge', 'prune', 'clean']
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_MESSAGES'], clientPermissions: ['MANAGE_MESSAGES'] }
  }

  async run ({ author, channel, send, t, query }) {
    const embed = new SimplicityEmbed({ t, author })
    const total = parseInt(query)

    if (!total || total < 2 || total > 100) throw new CommandError('commands:clear.invalidValue')

    const res = await channel.messages.fetch({ limit: total })
    await channel.bulkDelete(res).catch(() => {
      throw new CommandError('commands:clear.error')
    })

    const amount = res.size
    embed.setDescription('commands:clear.deleted', { amount, author })

    const msg = await send(embed)

    msg.delete({ timeout: 5000, reason: t('commands:clear.reason', { amount, auth: author.tag, authID: author.id }) })
  }
}

module.exports = Clear
