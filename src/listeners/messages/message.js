'use strict';

const { LANGUAGE, PREFIX } = require('@data/config');
const { CommandContext, SimplicityListener } = require('@structures');
const Logger = require('@util/Logger');
const { escapeRegExp } = require('@util/Util');
const i18next = require('i18next');

class MessageListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  // eslint-disable-next-line complexity
  async on(client, message) {
    const { author, channel, content, guild, cleanContent } = message;
    if (author.bot || (guild && !channel.permissionsFor(client.user).has('SEND_MESSAGES'))) return;

    const guildData = client.database && await client.database.guilds.get(message.guild.id);
    const prefix = (guildData && guildData.prefix) || PREFIX;
    const fixedPrefix = escapeRegExp(prefix);
    const language = (guildData && guildData.lang) || LANGUAGE;

    const usernameFixed = escapeRegExp(client.user.username);
    // eslint-disable-next-line no-useless-escape
    const PrefixRegex = new RegExp(`^(<@!?${client.user.id}>|${fixedPrefix}|${usernameFixed})(\\s+)?`, 'i');
    let usedPrefix = content.match(PrefixRegex);
    usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];
    const MentionRegex = new RegExp(`^(<@!?${client.user.id}>)`);
    const mentioned = MentionRegex.test(content);

    const commandsDisabled = guildData && guildData.disableChannels && guildData.disableChannels.includes(channel.id);
    const t = i18next.getFixedT(language);

    if (mentioned && !usedPrefix) {
      if (commandsDisabled) return author.send(t('common:commandsBlocked'));
      return message.reply(t('common:prefix', { prefix }));
    }

    if (usedPrefix) {
      const args = content.slice(usedPrefix.length).trim().split(/ +/g);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.fetch(commandName);

      if (command && command.name !== 'disable' && commandsDisabled) return author.send(t('common:commandsBlocked'));
      if (mentioned && !command) {
        if (commandsDisabled) return author.send(t('common:commandsBlocked'));
        return message.reply(t('common:prefix', { prefix }));
      }

      if (command) {
        const totalLength = usedPrefix.length + commandName.length;
        const params = { args, command, guildData, language, message, prefix, query: args.join(' '), totalLength };
        command.handle(new CommandContext(params), args).catch(console.error);
        Logger.logCommand({ author: author.tag, channel: channel.name, content: cleanContent, guild: guild.name });
      }
    }
  }
}

module.exports = MessageListener;
