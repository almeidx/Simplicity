class Collector {
  static async handle (message, reactionOptions = {}, messageOptions = {}) {
    if (reactionOptions && (!message.guild || message.channel.permissionsFor(message.guild.me).has('ADD_REACTIONS'))) {
      const { filter, options, reactions, exec, text } = this.setup('reaction', message.author.id, reactionOptions)
      await exec()
      const msg = await message.channel.send(text)
      for (const i in reactions) await msg.react(reactions[i])
      const collector = message.createReactionCollector(filter, options)
      return { type: 'reaction', collector }
    }

    const { filter, options, exec } = this.setup('message', messageOptions)
    await exec()
    const collector = message.channel.createMessageCollector(filter, options)
    return { type: 'message', collector }
  }

  static setup (type, userID, options) {
    if (type === 'reaction') {
      if (!options.filter && (!Array.isArray(options.reactions) || options.reactions.length === 0)) throw Error('Collector: ReactionOptions have no emojis')
      return Object.assign({
        reactions: [],
        filter: (r, u) => u.id === userID && r.me,
        options: {},
        text: '',
        exec: () => {}
      }, options)
    }
    if (!options.filter && (!Array.isArray(options.words) || options.words.length === 0)) throw Error('Collector: MessageOptions have no words')
    return Object.assign({
      words: [],
      filter: (m) => m.author.id === userID && options.words.map(i => i.toLowerCase()).includes(m.content.toLowerCase()),
      text: '',
      options: {},
      exec: () => {}
    }, options)
  }
}

module.exports = Collector
