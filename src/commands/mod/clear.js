const { Command, Embed } = require('../../')

class Clear extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['purge', 'prune', 'clean']
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_MESSAGES'], clientPermissions: ['MANAGE_MESSAGES'] }
  }
  async run ({ author, channel, send, t, query }) {
    const embed = new Embed({ t, author })
    const total = parseInt(query)

    if (!total || total <= 1 || total >= 101) {
      return send(embed.setDescription('commands:clear.invalidValue').setError())
    }

    const res = await channel.messages.fetch({ limit: total })
    await channel.bulkDelete(res).catch(() => {
      return send(embed.setDescription('error:denied').setError())
    })

    send(embed.setDescription('commands:clear.deleted', { amt: res.size, auth: author }))
      .then(async msg => {
        await msg.delete({ timeout: 10000, reason: t('commands:clear.reason', { count: total, auth: author.tag, authID: author.id }) })
      })
  }
}
module.exports = Clear
