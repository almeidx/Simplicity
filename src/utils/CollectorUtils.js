const SimplicityEmbed = require('../structures/Embed')
// Only Collector Message
class CollectorMessageUtils {
  static checkContent (content, query) {
    return (content === query) || (content.startsWith(query))
  }

  static onEnd ({ t, author, send }, responses = {}, collector, reasonParam) {
    collector.forEach(message => this.deleteMessage(message))

    responses = Object.assign({
      time: t('utils:commandTimedout'),
      cancel: t('utils:cancelled')
    }, responses)

    const response = responses[reasonParam]
    if (response) {
      const embed = new SimplicityEmbed(author)
        .setDescription(response)
        .setText('@description')
      return send(embed)
    }
  }

  static deleteMessage (message) {
    const client = message.client
    const guild = message.guild
    const memberClient = guild && client && guild.member(client.user)
    if (memberClient && message.permissionsFor(memberClient).has('MANAGE_MESSAGS')) message.delete()
  }
}

module.exports = { CollectorMessageUtils }
