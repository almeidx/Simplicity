import i18next, { TFunction, TOptions } from 'i18next';
import CommandUtil from './CommandUtil';
import CommandContext from './CommandContext';
import SimplicityEmbed from '../discord/SimplicityEmbed';
import { Logger, Util } from '../../util';

export interface Error {
  code?: string;
}

const getTranslation = (path: string, t: TFunction) => i18next.exists(path) && t(path);

export default class CommandError extends Error {
  notEmbed: boolean;
  showUsage: boolean;
  tOptions: TOptions;

  constructor(
    message: string, options: TOptions & { showUsage?: boolean, notEmbed?: boolean } = {},
  ) {
    super(message);
    this.showUsage = !!options.showUsage;
    this.notEmbed = !!options.notEmbed;
    this.tOptions = options;
  }

  static handle(error: CommandError | Error, ctx: CommandContext): void {
    if (error instanceof CommandError) {
      CommandError.sendErrorMessage(ctx.t(error.message, error.tOptions), error.showUsage, ctx);
    } else {
      const errorTranslation = error.code && getTranslation(`api_errors:${error.code}`, ctx.t);
      const errorMessage = typeof errorTranslation === 'string'
        ? errorTranslation
        : ctx.t('errors:errorCommand');
      CommandError.sendErrorMessage(errorMessage, false, ctx);
      Logger.error(error);
      CommandError.sendLogChannel(error, ctx);
    }
  }

  static sendErrorMessage(
    errorMessage: string,
    onUsage: boolean,
    ctx: CommandContext,
  ): void {
    const usage = onUsage
      && ctx.command.usagePath
      && CommandUtil.getUsage(ctx);
    const keyUsage = onUsage && ctx.t('errors:usage');

    if (!Util.canSendEmbed(ctx.message)) {
      let message = errorMessage;
      if (usage) message += `\n**${keyUsage}**: ${usage}`;
      ctx.send(message);
      return;
    }

    const embed = new SimplicityEmbed(ctx.client.user, { autoFooter: false, t: ctx.t, type: 'error' })
      .setDescription(errorMessage)
      .setFooter(ctx.author);

    if (usage && keyUsage) {
      embed.addField(keyUsage, usage);
    }
    ctx.send(embed);
  }

  static sendLogChannel(error: Error, ctx: CommandContext): void {
    const embed = new SimplicityEmbed(ctx.author, { type: 'error' })
      .setDescription(`
      » User: ${ctx.author.id}
      » Channel: ${ctx.channel.id}
      » Guild: ${ctx.guild ? ctx.guild.id : 'Direct Message'}
      `)
      .addField('» Message', ctx.message.content)
      .addField('» Error', `\`\`\`${error}\`\`\``)
      .setThumbnail(ctx.guild || ctx.author);

    Util.sendPrivateMessage(ctx.client, 'ERROR_LOG', embed);
  }
}
