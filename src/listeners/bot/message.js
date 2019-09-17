'use strict';

const { Logger, CommandContext, SimplicityListener, Utils: { escapeRegExp } } = require('../../');
const i18next = require('i18next');

class MessageListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  // eslint-disable-next-line complexity
  async on(client, message) {
    const { author, channel, content, guild } = message;
    if (author.bot || (guild && !channel.permissionsFor(client.user).has('SEND_MESSAGES'))) return;

    const guildData = client.database && await client.database.guilds.get(message.guild.id);
    const prefix = (guildData && guildData.prefix) || process.env.PREFIX;
    const fixedPrefix = escapeRegExp(prefix);
    const language = (guildData && guildData.lang) || process.env.DEFAULT_LANG;

    const usernameFixed = escapeRegExp(client.user.username);
    // eslint-disable-next-line no-useless-escape
    const PrefixRegex = new RegExp(`^(<@!?${client.user.id}>|${fixedPrefix}|${usernameFixed})(\s+)?`, 'i');
    let usedPrefix = content.match(PrefixRegex);
    usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];
    const MentionRegex = new RegExp(`^(<@!?${client.user.id}>)`);
    const mentioned = MentionRegex.test(content);
    const helpPrefix = i18next.getFixedT(language)('common:prefix', { prefix });

    if (mentioned && !usedPrefix) return message.reply(helpPrefix);

    if (usedPrefix) {
      const args = content.slice(usedPrefix.length).trim().split(/ +/g);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.fetch(commandName);

      if (mentioned && !command) return message.reply(helpPrefix);

      if (command && !command.running.has(channel.id, author.id)) {
        const totalLength = usedPrefix.length + commandName.length;
        const params = { args, command, language, message, prefix, query: args.join(' '), totalLength };
        command._run(new CommandContext(params)).catch(console.error);
        Logger.logCommand({ guild: guild.name, channel: channel.name, author: author.tag, content });
      }
    }
  }
}

module.exports = MessageListener;
