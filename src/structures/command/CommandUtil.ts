import { Embed } from '..';
import { PermissionUtil, Util } from '../../util';
import CommandContext from './CommandContext';

/**
 * Contains various command utility methods.
 * @class CommandUtil
 */
export default class CommandUtil {
  /**
   * Gets the usage of a specific command.
   * @param {*} options The options for the usage.
   * @param {boolean} [full=true] Wether to return the prefix, command and usage at once.
   * @returns {string} The usage.
   */
  static getUsage(ctx: CommandContext, full = true): string {
    const usage = ctx.command.getUsage(ctx.t);
    if (!full || !ctx.prefix) return usage;
    return `${ctx.prefix + ctx.command.name} ${usage}`;
  }

  /**
   * Returns all the info required on the help command.
   * @param {Object} options The options for the help command.
   * @returns {Embed}
   */
  static getHelpEmbed(ctx: CommandContext): Embed {
    const { t, command, prefix } = ctx;
    const noneTranslation = t('commons:none');

    const embed = new Embed(t)
      .setTitle(CommandUtil.getUsage(ctx))
      .setDescription(`$$commands:${command.name}.description`);

    embed.addField('$$commands:help.commandName', command.name, true);

    const aliases = command.aliases.map((a) => `\`${a}\``).join(' ');
    embed.addField('$$common:aliases', aliases || noneTranslation, true);

    const userPermissions = PermissionUtil.normalize(command.requirements.userPermissions, t).join(', ');
    embed.addField('$$commands:help.requiredUserPermissions', userPermissions || noneTranslation, false);

    const clientPermissions = PermissionUtil.normalize(command.requirements.clientPermissions, t).join(', ');
    embed.addField('$$commands:help.requiredClientPermissions', clientPermissions || noneTranslation, true);

    if (command.examplesPath) {
      const examples = t(command.examplesPath, { returnObjects: true }) as string[];
      if (!Util.isEmpty(examples.length && Array.isArray(examples))) {
        const examplesFixed = examples.map((e) => `${prefix}${command.name} ${e}`).join('\n');
        embed.addField('$$common:examples', examplesFixed, true);
      }
    }

    // Add subcommands
    // const subcommands = command.subcommands && command.subcommands.map((sub) => {
    //   const commandName = `\`${prefix + command.name} ${sub.name}\` `;
    //   return `${commandName} ${t(`$$commands:${command.name}-${sub.name}.description`)}`;
    // });

    // if (!isEmpty(subcommands)) {
    //   embed.addField('$$common:subcommands', subcommands.join('\n'));
    // }
    return embed;
  }
}
