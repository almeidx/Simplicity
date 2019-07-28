'use strict';

const { CommandContext, SimplicityListener } = require('../../');

class Message extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  // eslint-disable-next-line complexity
  async on(client, message) {
    if (message.author.bot || (message.guild && !message.guild.me.permissions.has('SEND_MESSAGES'))) return;

    const guildData = await client.database.guilds.get(message.guild.id);
    const prefix = (guildData && guildData.prefix) || process.env.PREFIX;
    const language = (guildData && guildData.lang) || process.env.DEFAULT_LANG;

    const cleanMention = client.user.toString();
    const botMention = (message.guild && message.guild.me.toString()) || cleanMention;
    const startsWithBotMention = message.content.startsWith(botMention) ? `${botMention} ` : null;
    const startsWithCleanMention = message.content.startsWith(cleanMention) ? `${cleanMention} ` : null;
    const startsWithPrefix = message.content.toLowerCase().startsWith(prefix.toLowerCase()) ? prefix : null;

    const usedPrefix = startsWithBotMention || startsWithCleanMention || startsWithPrefix;
    const clientIsMentioned = message.mentions.has(client.user.id, { ignoreRoles: true, ignoreEveryone: true });

    if (clientIsMentioned && !usedPrefix) return message.reply(
      client.i18next.getFixedT(language)('common:prefix', { prefix })
    );

    if (usedPrefix) {
      const args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.fetch(commandName);

      if (clientIsMentioned && !command) return message.reply(
        client.i18next.getFixedT(language)('common:prefix', { prefix })
      );

      if (command && !command.running.has(message.channel.id, message.author.id)) {
        const totalLength = usedPrefix.length + commandName.length;
        command._run(new CommandContext({
          totalLength,
          prefix,
          language,
          query: args.join(' '),
          command,
          message,
          args,
        })).catch(console.error);
        client.logger.commandUsage(
          'Command', `${message.guild.name} #${message.channel.name} @${message.author.tag} ${message.content}`
        );
      }
    }
  }
}

module.exports = Message;
