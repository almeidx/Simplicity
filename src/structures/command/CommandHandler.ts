import { Message, TextChannel } from 'discord.js';
import i18next from 'i18next';
import { CommandContext } from '..';
import { Logger, Util } from '../../util';
import Config from '../../config';

export default class CommandHandler {
  static isInvalidMessage(message: Message): boolean {
    return message.author.bot
      || !message.guild
      || (message.channel instanceof TextChannel
      && !message.channel.permissionsFor(String(message.client.user?.id))?.has('SEND_MESSAGES'));
  }

  static clientMentioned(message: Message): boolean {
    const MentionRegex = new RegExp(`^(<@!?${message.client.user?.id}>)`);
    return MentionRegex.test(message.content);
  }

  static findPrefix(prefix: string, { client, content }: Message): string | null {
    const fixedPrefix = Util.escapeRegExp(prefix);
    const usernameFixed = Util.escapeRegExp(String(client.user?.username));
    const PrefixRegex = new RegExp(`^(<@!?${client.user?.id}>|${fixedPrefix}|${usernameFixed})(\\s+)?`, 'i');
    const matchPrefix = content.match(PrefixRegex);
    if (matchPrefix && matchPrefix.length) {
      return matchPrefix[0];
    }
    return null;
  }

  static async handle(message: Message): Promise<void> {
    if (CommandHandler.isInvalidMessage(message)) {
      return;
    }

    const {
      author, channel, content, client,
    } = message;

    const guildData = await client.database?.findGuild(String(message.guild?.id));
    const prefix = guildData?.prefix ?? Config.PREFIX;
    const language = guildData?.language ?? Config.LANGUAGE;

    const usedPrefix = CommandHandler.findPrefix(prefix, message);
    const mentioned = CommandHandler.clientMentioned(message);

    const channelDisabled = guildData?.disabledChannels.includes(channel.id);
    const t = i18next.getFixedT(language);

    if (mentioned && !usedPrefix) {
      if (channelDisabled) {
        author.send(t('common:commandsBlocked'));
        return;
      }
      message.reply(t('common:prefix', { prefix }));
      return;
    }

    if (usedPrefix) {
      const args = content.slice(usedPrefix.length).trim().split(/ +/g);
      const commandName = args.shift()?.toLowerCase() as string;
      const command = client.commands.get(commandName);

      if (command && command.name !== 'disable' && channelDisabled) {
        author.send(t('common:commandsBlocked'));
        return;
      }

      if (mentioned && !command) {
        if (channelDisabled) {
          author.send(t('common:commandsBlocked'));
          return;
        }
        message.reply(t('common:prefix', { prefix }));
        return;
      }

      if (command) {
        const commandContext = new CommandContext({
          args, guildData, language, message, prefix, command, t,
        });
        Logger.logCommand(message);
        command.handle(commandContext).catch(Logger.error);
      }
    }
  }
}
