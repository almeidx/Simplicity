/* eslint-disable max-len */

// const SimplicityEmbed = require('@discord/SimplicityEmbed');
// const PermissionUtil = require('@util/PermissionUtil');
// const { isEmpty } = require('@util/Util');
/**
 * Contains various command utility methods
 */
export default class CommandUtil {
  // /**
  //  * Gets the usage of a specific command
  //  * @paramoptions The options for the usage
  //  * @param full Wether to return the prefix, command and usage at once
  //  * @returns The usage
  //  */
  // static getUsage({ command, prefix, t }, full = true) {
  //   const usage = command.getUsage(t);
  //   if (!full || !prefix) return usage;
  //   else return `${prefix + command.name} ${usage}`;
  // }

  // /**
  //  * Returns all the info required on the help command
  //  * @param options The options for the help command
  //  * @returns
  //  */
  // static getHelp({ client, command, prefix, t }) {
  //   command = typeof command === 'string' ? client.commands.fetch(command) : command;

  //   const noneTranslation = t('commons:none');

  //   const embed = new SimplicityEmbed({ t })
  //     .setTitle(CommandUtil.getUsage({ command, prefix, t }))
  //     .setDescription(`$$commands:${command.name}.description`);

  //   embed.addField('$$commands:help.commandName', command.name, true);

  //   const aliases = command.aliases.map((a) => `\`${a}\``).join(' ');
  //   embed.addField('$$common:aliases', aliases || noneTranslation, true);

  //   const userPermissions = PermissionUtil.normalize(command.requirements.permissions, t).join(', ');
  //   embed.addField('$$commands:help.requiredUserPermissions', userPermissions || noneTranslation, false);

  //   const clientPermissions = PermissionUtil.normalize(command.requirements.clientPermissions, t).join(', ');
  //   embed.addField('$$commands:help.requiredClientPermissions', clientPermissions || noneTranslation, true);

  //   if (command.examplesPath) {
  //     const examples = t(command.examplesPath, { returnObjects: true });
  //     if (!isEmpty(examples.length)) {
  //       const examplesFixed = examples.map((e) => `${prefix}${command.name} ${e}`).join('\n');
  //       embed.addField('$$common:examples', examplesFixed, true);
  //     }
  //   }

  //   // Add subcommands
  //   const subcommands = command.subcommands && command.subcommands.map((sub) => {
  //     const commandName = `\`${prefix + command.name} ${sub.name}\` `;
  //     return `${commandName} ${t(`$$commands:${command.name}-${sub.name}.description`)}`;
  //   });

  //   if (!isEmpty(subcommands)) {
  //     embed.addField('$$common:subcommands', subcommands.join('\n'));
  //   }
  //   return embed;
  // }
}
