const LogUtils = require('../../utils/LogUtils')
const SimplicityEmbed = require('./SimplicityEmbed')
const i18next = require('i18next')

class SimplicityListener {
  constructor (client) {
    this.client = client
    this.database = client.database
  }

  on () {}

  async getLogOptions (guildID, id) {
    const guild = this.client && guildID && this.client.guilds.get(guildID)
    const channelData = guild && await LogUtils.getChannel(this.client, guild, id)
    return channelData
  }

  async getFixedT (guildID) {
    const guild = this.client && guildID && this.client.guilds.get(guildID)
    const guildData = guild && await this.database.guilds.get(guildID)
    const language = (guildData && guildData.language) || 'en-US'
    return i18next.getFixedT(language)
  }

  async sendMessage (id, content) {
    const resultPrivate = this.sendPrivateMessage(id, content)
    if (resultPrivate === false) return resultPrivate
    else await this.sendLogMessage(id, content)
  }

  async sendLogMessage (guildID, log, content) {
    const channelData = await this.getLogOptions(guildID, log)
    if (channelData) {
      if (content instanceof SimplicityEmbed) content.setTranslator(channelData.t)
      LogUtils.send(channelData.channel, content).catch(() => null)
    }
  }

  sendPrivateMessage (envName, content) {
    const id = envName && process.env[envName.toUpperCase()]
    const channel = this.client && id && this.client.channels.get(id)
    if (channel) return channel.send(content)
    else return false
  }
}

module.exports = SimplicityListener
