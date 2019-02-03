const { Command } = require('../../')

class Clear extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['purge', 'prune', 'clean']
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_MESSAGES'], clientPermissions: ['MANAGE_MESSAGES'] }
  }
  async run ({ author, channel, send, t, args }) {
    let amount = [args]
    let total = parseInt(amount)
    if (!total || total <= 2 || total >= 100) {
      return send(t('commands:clear.invalidValue'))
    }
    const res = await channel.messages.fetch({ limit: amount })
    await channel.bulkDelete(res)
      .catch(() => {
        return send(t('errors:general'))
      })
    send(t('commands:clear.deleted'), { amt: res.size, auth: author })
      .then(m => m.delete(7000))
      .catch(err => console.log(err))
  }
}
module.exports = Clear
