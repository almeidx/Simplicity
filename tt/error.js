const { Embed } = require('../src')
function Error (error) {
  if (error.message === 'Unexpected server response: 520') {
    console.log('Cant connect to Discords API, Retrying...')
  } else if (error.message === 'read ECONNRESET') {
    console.log('Connection Reset! Reconnecting...')
  } else {
    console.error(error)
  }

  if (process.env.CHANNEL_LOG_ERROR && this.channels.has(process.env.CHANNEL_LOG_ERROR)) {
    const channel = this.channels.get(process.env.CHANNEL_LOG_ERROR)

    const embed = new Embed()
      .setTimestamp()
      .setAuthor(this.user.tag, this.user.displayAvatarURL())
      .setDescription(error.stack)

    channel.send(embed)
  }
}

module.exports = Error
