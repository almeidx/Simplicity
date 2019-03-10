const { Embed } = require('../')

function Error (error) {
  if (error.message === 'Unexpected server response: 520') {
    console.error('Cant connect to Discords API, Retrying...')
  } else if (error.message === 'read ECONNRESET') {
    console.error('Connection Reset! Reconnecting...')
  } else {
    console.error(error)
  }

  if (process.env.CHANNEL_LOG_ERROR && this.channels.has(process.env.CHANNEL_LOG_ERROR)) {
    const channel = this.channels.get(process.env.CHANNEL_LOG_ERROR)

    const embed = new Embed()
      .setTimestamp()
      .setAuthor(this.user.tag, this.user.displayAvatarURL())
      .setDescription(error.stack)

    channel.send(embed).catch(e => console.error(e))
  }
}

module.exports = Error
