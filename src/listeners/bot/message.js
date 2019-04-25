const { CommandContext, SimplicityListener } = require('../../')

class Message extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  async on (client, message) {
    if (message.author.bot || (message.guild && !message.guild.me.permissions.has('SEND_MESSAGES'))) return

    const guildData = await client.database.guilds.get(message.guild.id)
    const prefix = (guildData && guildData.prefix) || process.env.PREFIX
    const language = (guildData && guildData.lang) || process.env.DEFAULT_LANG

    const cleanMention = client.user.toString()
    const botMention = (message.guild && message.guild.me.toString()) || cleanMention
    const startsWithBotMention = message.content.startsWith(botMention) ? `${botMention} ` : null
    const startsWithCleanMention = message.content.startsWith(cleanMention) ? `${cleanMention} ` : null
    const startsWithPrefix = message.content.toLowerCase().startsWith(prefix.toLowerCase()) ? prefix : null

    const usedPrefix = startsWithBotMention || startsWithCleanMention || startsWithPrefix
    const clientIsMentioned = message.mentions.has(client.user.id)

    if (clientIsMentioned && !usedPrefix) {
      return message.reply(client.i18next.getFixedT(language)('common:prefix', { prefix }))
    }

    if (usedPrefix) {
      const args = message.content.slice(usedPrefix.length).trim().split(/ +/g)
      const commandName = args.shift().toLowerCase()
      const command = client.commands.fetch(commandName)

      const permissions = message.guild.me.permissions
      if (clientIsMentioned && permissions.has(['USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS']) && client.emojis.has(process.env.EMOJI_PINGSOCK_ID) && !command) {
        await message.react(process.env.EMOJI_PINGSOCK_ID)
        return message.reply(client.i18next.getFixedT(language)('common:prefix', { prefix }))
      }

      if (command && !command.running.has(message.channel.id, message.author.id)) {
        const totalLength = usedPrefix.length + commandName.length
        command._run(new CommandContext({
          totalLength,
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
