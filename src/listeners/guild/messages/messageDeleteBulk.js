const { SimplicityEmbed, SimplicityListener, Constants } = require('../../../index')

class MessageDeleteBulk extends SimplicityListener {
  constructor (client) {
    super(client)
  }

on (_, messages, t) {

    const message = messages.first()
    const { t } = await client.database.guilds.get(message.guild.id)

    const embed = new SimplicityEmbed({ t })
      .setTimestamp()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription('loggers:messageDeleteBulk', { amount: messages.size, channel: message.channel })
      .setColor(Constants.COLORS.MESSAGE_BULK_DELETE)

    this.sendMessage('messageBulkDelete', embed).catch(() => null)
  }
}

module.exports = MessageDeleteBulk
