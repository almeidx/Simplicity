'use strict';

const LogUtil = require('@util/LogUtil');
const SimplicityEmbed = require('./SimplicityEmbed');
const i18next = require('i18next');

/**
 * Main Listener class.
 * @class SimplicityListener
 */
class SimplicityListener {
  /**
   * Creates an instance of SimplicityListener.
   * @param {Client} client The Listener's Client.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * What gets ran when the event is triggered.
   * @return {void}
   */
  on() {
    throw new Error(`${this.constructor.name} doesn't have an on() method.`);
  }

  /**
   * Gets the language for a guild.
   * @param {string} guildID The ID of the guild.
   * @return {i18next} The language object.
   */
  async getFixedT(guildID) {
    const guild = this.client && guildID && this.client.guilds.cache.get(guildID);
    const guildData = guild && this.database && await this.database.guilds.cache.get(guildID);
    const language = (guildData && guildData.language) || 'en-US';
    return i18next.getFixedT(language);
  }

  /**
   * Either sends a log message or a message using an ENV variable.
   * @param {*} id
   * @param {*} content
   * @return {void}
   */
  async sendMessage(id, content) {
    const resultPrivate = this.sendPrivateMessage(id, content);
    if (resultPrivate === false) return resultPrivate;
    await this.sendLogMessage(id, content);
  }

  /**
   * Sends a message to the logging channel of a guild.
   * @param {string} guildID The ID of the guild.
   * @param {string} log The name of the log.
   * @param {MessageEmbed|string} content The content to send.
   * @return {void}
   */
  async sendLogMessage(guildID, log, content) {
    const channelData = await this.getLogOptions(guildID, log);
    if (channelData) {
      if (content instanceof SimplicityEmbed) content.setTranslator(channelData.t);
      LogUtil.send(channelData.channel, content).catch(() => null);
    }
  }

  /**
   * Sends a private message using an ENV variable.
   * @param {string} envName The name of the env variable.
   * @param {MessageEmbed|string} content The content to send.
   * @return {boolean|Promise<Message>} The message sent or false.
   */
  sendPrivateMessage(envName, content) {
    const id = envName && process.env[envName.toUpperCase()];
    const channel = this.client && id && this.client.channels.cache.get(id);
    if (channel) return channel.send(content);
    return false;
  }
}

module.exports = SimplicityListener;
