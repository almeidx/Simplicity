import { Message, TextChannel } from 'discord.js';
import i18next from 'i18next';
import {
  SimplicityClient, SimplicityListener, CommandContext,
} from '../structures';
import { Logger, Util } from '../util';
import Config from '../config';

export default class ErrorListener extends SimplicityListener {
  constructor(client: SimplicityClient) {
    super('message', client);
  }

  async exec(message: Message): Promise<void> {
    const {
      author, channel, content,
    } = message;

    if (
      author.bot
      || !message.guild
      || (
        channel instanceof TextChannel
        && !channel.permissionsFor(String(this.client.user?.id))?.has('SEND_MESSAGES')
      )) return;

    const guildData = await this.client.database?.findGuild(message.guild.id);
    const prefix = guildData?.prefix ?? Config.PREFIX;
    const fixedPrefix = Util.escapeRegExp(prefix);
    const language = guildData?.language ?? Config.LANGUAGE;

    const usernameFixed = Util.escapeRegExp(String(this.client.user?.username));
    // eslint-disable-next-line no-useless-escape
    const PrefixRegex = new RegExp(`^(<@!?${this.client.user?.id}>|${fixedPrefix}|${usernameFixed})(\\s+)?`, 'i');
    const matchPrefix = content.match(PrefixRegex);
    const usedPrefix = matchPrefix && matchPrefix.length && matchPrefix[0];
    const MentionRegex = new RegExp(`^(<@!?${this.client.user?.id}>)`);
    const mentioned = MentionRegex.test(content);

    const commandsDisabled = guildData?.disableChannels.includes(channel.id);
    const t = i18next.getFixedT(language);

    if (mentioned && !usedPrefix) {
      if (commandsDisabled) {
        author.send(t('common:commandsBlocked'));
        return;
      }
      message.reply(t('common:prefix', { prefix }));
      return;
    }

    if (usedPrefix) {
      const args = content.slice(usedPrefix.length).trim().split(/ +/g);
      const commandName = args.shift()?.toLowerCase() as string;
      const command = this.client.commands.get(commandName);

      if (command && command.name !== 'disable' && commandsDisabled) {
        author.send(t('common:commandsBlocked'));
        return;
      }

      if (mentioned && !command) {
        if (commandsDisabled) {
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
        command.handle(commandContext).catch(Logger.error);
        Logger.logCommand(message);
      }
    }
  }
}
