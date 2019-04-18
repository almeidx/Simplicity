const SimplicityEmbed = require('../../structures/discord/SimplicityEmbed')

class MessageCollectorUtils {
  static run (dependencies, responses, callback) {
    const { channel, author, command, msg } = dependencies

    const filter = (m) => m.author.id === author.id
    const collector = channel.createMessageCollector(filter, { max: 3, time: 30000, errors: ['time'] })
    const incorrectResponseMessages = []
    incorrectResponseMessages.push(msg)
    command.running.add(channel.id, author.id)

    collector.on('collect', (message) => {
      if (this.checkContent(message, 'confirm')) {
        callback(dependencies)
        collector.stop('finish')
      } else if (this.checkContent(message, 'cancel')) {
        collector.stop('cancel')
      } else {
        if (collector.collected.size !== collector.options.max) {
          this.incorrectResponse(dependencies, message, collector.collected, incorrectResponseMessages)
        }
      }
    })

    collector.on('end', (...params) => this.onEnd(dependencies, responses, incorrectResponseMessages, ...params))
  }

  static incorrectResponse ({ send, t }, message, collected, messages) {
    const embed = new SimplicityEmbed(t)
      .setDescription('common:messageCollector:incorrectResponse', { count: collected.size })
      .setText('@description')

    send(embed).then(m => {
      messages.push(m)
      messages.push(message)
      setTimeout(() => {
        this.deleteMessage(m)
        this.deleteMessage(message)
      }, 10000)
    })
  }

  static checkContent (message, query) {
    const content = message.content.toLowerCase()
    return (content === query) || (content.startsWith(query))
  }

  static onEnd ({ t, channel, command, author, send }, responses = {}, messages, { size: amount }, reasonParam) {
    command.running.remove(channel.id, author.id)

    messages.forEach(m => this.deleteMessage(m))

    responses = Object.assign({
      time: t('common:messageCollector.time'),
      cancel: t('common:messageCollector.cancel'),
      limit: t('common:messageCollector.limit', { amount })
    }, responses)

    const response = responses[reasonParam]
    if (response) {
      const embed = new SimplicityEmbed(author, { autoAuthor: false, type: 'error' })
        .setDescription(response)
        .setText('@description')
      send(embed).then(m => this.deleteMessage(m, { timeout: 60000 }))
    }
  }

  static deleteMessage (message, options = {}) {
    const client = message.client
    const guild = message.guild
    const memberClient = guild && client && guild.member(client.user)
    const clientHasPermission = memberClient && message.channel.permissionsFor(memberClient).has('MANAGE_MESSAGES')
    const authorIsClient = client && (client.user.id === message.author.id)
    if (!message.deleted && (authorIsClient || clientHasPermission)) {
      return message.delete(options).catch(() => null)
    }
  }
}

module.exports = MessageCollectorUtils
