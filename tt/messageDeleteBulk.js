const { SimplicityEmbed, LogUtils, Constants } = require('../src')

async function messageDeleteBulk (messages) {
  const message = messages.first()
  const { channel, t } = await LogUtils.getChannel(this, message.guild, 'JOIN_AND_LEAVE')

  if (channel) {
    const embed = new SimplicityEmbed({ t })
      .setTimestamp()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription('loggers:messageDeleteBulk', { amount: messages.size, channel: message.channel })
      .setColor(Constants.COLORS.MESSAGE_BULK_DELETE)

    LogUtils.send(channel, embed).catch(e => console.error(e))
  }
}

module.exports = messageDeleteBulk
