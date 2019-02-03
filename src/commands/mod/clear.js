const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')

class Clear extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['purge', 'prune', 'clean']
    this.category = 'mod'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_MESSAGES'], clientPermissions: ['MANAGE_MESSAGES'] }
  }
  async run ({ author, channel, send, t, query }) {
    const embed = new MessageEmbed()
    let amount = query
    let total = parseInt(amount)
    if (!total || total <= 1 || total >= 101) {
      return send(embed.setDescription(t('commands:clear.invalidValue')), { error: true })
    }
    const res = await channel.messages.fetch({ limit: total })
    await channel.bulkDelete(res).catch(() => {
      return send(embed, { error: true })
    })
    send(embed.setDescription(t('commands:clear.deleted'), { amt: res.size, auth: author }))
      .then(msg => {
        msg.delete({ options: { timeout: 10000 } })
      })
  }
}
module.exports = Clear
