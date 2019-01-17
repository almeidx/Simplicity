const { CommandContext, Loggers } = require('../')

module.exports = async function onMessage (message) {
  if (message.author.bot || message.type === 'dm' || !message.guild.me.permissions.has('SEND_MESSAGES')) return

  const guildData = await this.database.guilds.get(message.guild.id)
  const prefix = (guildData && guildData.prefix) ? guildData.prefix : process.env.PREFIX

  const botMention = message.guild.me.toString()
  const usedPrefix = message.content.startsWith(botMention) ? `${botMention} ` : (message.content.startsWith(prefix) ? prefix : null)

  if (usedPrefix) {
    const args = message.content.slice(usedPrefix.length).trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    const command = this.fetchCommand(commandName)

    if (message.mentions.has(this.user.id) && message.guild.me.permissions.has(['USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS']) && this.emojis.has(process.env.EMOJI_PINGSOCK_ID) && !command) {
      return message.react(process.env.EMOJI_PINGSOCK_ID)
    }

    if (command) {
      command._run(new CommandContext({
        prefix: usedPrefix,
        language: guildData ? guildData.lang : process.env.DEFAULT_LANG,
        query: args.join(' '),
        command,
        message,
        args
      }))
      Loggers.warn(['COMMAND', 'USAGE'], `${message.guild.name} #${message.channel.name} @${message.author.tag} ${message.content}`)
    }
  }
}
