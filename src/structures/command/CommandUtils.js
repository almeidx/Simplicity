'use strict';

const SimplicityEmbed = require('@discord/SimplicityEmbed');
const { fixText, isEmpty } = require('@utils/Utils');
const CommandError = require('./CommandError');
const i18next = require('i18next');
const getTranslation = (dirct, t, options = {}) => i18next.exists(dirct) && t(dirct, options);

/**
 * @class CommandUtils
 */
class CommandUtils {
  static getUsage({ command, prefix, t }, full = true) {
    const usage = getTranslation(`commands:${command.name}.usage`, t);
    if (!full || !prefix) return usage;
    else return `${prefix + command.name} ${usage || ''}`;
  }

  /**
   * All info of command
   * @return SimplicityEmbed
   */
  static getHelp({ client, command, prefix, t }) {
    command = typeof command === 'string' ? client.commands.fetch(command) : command;
    if (command.name === 'help') throw new CommandError('commands:help.commandHelp');

    const embed = new SimplicityEmbed({ author: client.user, t })
      .setDescription(`commands:${command.name}.description`)
      .setTitle(fixText(command.name), {}, false);

    // Add arguments
    const usage = CommandUtils.getUsage({ command, prefix, t });
    if (usage) embed.addField('common:usage', usage, true);

    // Add aliases
    if (!isEmpty(command.aliases)) {
      embed.addField('common:aliases', command.aliases.map((a) => `\`${a}\``).join(' '), true);
    }

    // Add examples
    const examples = getTranslation(`commands:${command.name}.examples`, t, { returnObjects: true });
    if (examples.lenght) {
      const examplesFixed = examples.map((e) => `${prefix}${command.name} ${e}`).join('\n');
      embed.addField('common:examples', examplesFixed, true);
    }

    // Add subcommands
    const subcommands = command.subcommands && command.subcommands.map((sub) => {
      const commandName = `\`${prefix + command.name} ${sub.name}\` `;
      return `${commandName} ${t(`commands:${command.name}-${sub.name}.description`)}`;
    });

    if (!isEmpty(subcommands)) {
      embed.addField('common:subcommands', subcommands.join('\n'));
    }
    return embed;
  }
}

module.exports = CommandUtils;
