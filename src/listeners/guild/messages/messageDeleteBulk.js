const { SimplicityEmbed, Listener, Constants } = require('../../../index')

class MessageDeleteBulk extends Listener {
  constructor (client) {
    super(client)
  }
  
  on (_, messages, t) {
    const message = messages.first()

    const embed = new SimplicityEmbed({ t })
      .setTimestamp()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription('loggers:messageDeleteBulk', { amount: messages.size, channel: message.channel })
      .setColor(Constants.COLORS.MESSAGE_BULK_DELETE)
    
    this.sendMessage('messageBulkDelete', embed).catch(() => null)
  }
}

module.exports = MessageDeleteBulk
