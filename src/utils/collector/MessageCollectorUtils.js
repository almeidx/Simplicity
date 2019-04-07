const SimplicityEmbed = require('../../structures/Embed')

class MessageCollectorUtils {
  static run (dependencies, responses, callback) {
    const { channel, author } = dependencies

    const filter = (m) => m.author.id === author
    const collector = channel.createMessageColletor(filter, { max: 5, time: 60000, errors: ['time'] })

    collector.on('collect', (message) => {
      if (this.checkContent(message, 'confirm')) {
        callback(dependencies)
        this.stop('finisth')
      } else if (this.checkContent(message, 'cancel')) {
        this.stop('cancel')
      } else {
        this.incorrectResponse(dependencies, collector.collected)
      }
    })

    collector.on('end', (...params) => this.onEnd(dependencies, responses, ...params))
  }

  static incorrectResponse ({ send, t }, collected) {
    const embed = SimplicityEmbed(t)
      .setDescription('utils:messageCollector:incorrectResponse', { count: collected.size })
      .toText('@description')

    send(embed).then(m => m.delete({ timeout: 10000 }))
  }

  static checkContent (message, query) {
    const content = message.content.tolowerCase()
    return (content === query) || (content.startsWith(query))
  }

  static onEnd ({ t, author, send }, responses = {}, collector, reasonParam) {
    console.log(reasonParam, this)
    collector.forEach(message => this.deleteMessage(message))

    responses = Object.assign({
      time: t('utils:messageCollector.time'),
      cancel: t('utils:messageCollector.cancel'),
      limit: t('utils:messageCollector.limit')
    }, responses)

    const response = responses[reasonParam]
    if (response) {
      const embed = new SimplicityEmbed(author)
        .setDescription(response)
        .setText('@description')
      send(embed).then(m => m.delete({ timeout: 60000 }))
    }
  }

  static deleteMessage (message) {
    const client = message.client
    const guild = message.guild
    const memberClient = guild && client && guild.member(client.user)
    if (memberClient && message.permissionsFor(memberClient).has('MANAGE_MESSAGS')) message.delete()
  }
}

module.exports = MessageCollectorUtils
