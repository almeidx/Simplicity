const { CommandContext, Listener } = require('../../')

class Message extends Listener {
  constructor (client) {
    super(client)
  }

  async on (client, message) {
    if (message.author.bot || message.type === 'dm' || !message.guild.me.permissions.has('SEND_MESSAGES')) return

    const guildData = await client.database.guilds.get(message.guild.id)

    const prefix = (guildData && guildData.prefix) || process.env.PREFIX
    const language = (guildData && guildData.lang) || process.env.DEFAULT_LANG

    const botMention = message.guild.me.toString()
    const usedPrefix = message.content.startsWith(botMention) ? `${botMention} ` : (message.content.toLowerCase().startsWith(prefix.toLowerCase()) ? prefix : null)

    if (message.content === botMention) {
      return message.reply(client.i18next.getFixedT(language)('utils:prefix', { prefix: prefix }))
    }

    if (usedPrefix) {
      const args = message.content.slice(usedPrefix.length).trim().split(/ +/g)
      const commandName = args.shift().toLowerCase()
      const command = client.commands.fetch(commandName)

      if (message.mentions.has(client.user.id) && message.guild.me.permissions.has(['USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS']) && client.emojis.has(process.env.EMOJI_PINGSOCK_ID) && !command) {
        return message.react(process.env.EMOJI_PINGSOCK_ID)
      }

      if (command) {
        command._run(new CommandContext({
          prefix,
          language,
          query: args.join(' '),
          command,
          message,
          args
        })).catch(e => console.error(e))
        client.logger.commandUsage('Command', `${message.guild.name} #${message.channel.name} @${message.author.tag} ${message.content}`)
      }
    }
  }
}

module.exports = Message
