const LogUtils = require('../utils/LogUtils')
const Embed = require('./Embed')

class Listener {
  constructor (client, logs = []) {
    this.client = client
    this.database = client.database
    this.logs = logs
  }

  on () {}

  async sendMessage (id, content) {
    const resultPrivate = this.sendPrivateMessage(id, content)
    if (resultPrivate === false) return resultPrivate
    else await this.sendLogMessage(id, content)
  }

  async sendLogMessage (guildID, content) {
    const guild = this.client && guildID && this.client.guilds.get(guildID)
    const channelData = guild && await LogUtils.getChannel(this.client, guild, this.logs[0])
    if (channelData) {
      if (content instanceof Embed) content.setTranslator(channelData.t)
      LogUtils.send(channelData.channel, content)
    }
  }

  sendPrivateMessage (envName, content) {
    const id = envName && process.env[envName.toUpperCase()]
    const channel = this.client && id && this.client.channels.get(id)
    if (channel) return channel.send(content)
    else return false
  }
}

module.exports = Listener
