'use strict';

const { CommandError, SimplicityEmbed, SimplicityListener } = require('@structures');
const CommandUtil = require('@util/CommandUtil');
const i18next = require('i18next');
const getTranslation = (dirct, t) => i18next.exists(dirct) && t(dirct);

class CommandErrorListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(client, error, { t, author, prefix, channel, guild, message, canEmbed, send, command }) {
    if (!(error instanceof CommandError)) {
      client.logger.error(error.stack);
      const errorTranslation = error.code && getTranslation(`api_errors:${error.code}`, t);
      const errorMessage = errorTranslation || t('errors:errorCommand');
      this.sendErrorCommandMessage(errorMessage, false, { author, canEmbed, command, send, t });

      const embed = new SimplicityEmbed(author, { type: 'error' })
        .setDescription(`
      » User: ${author.id}
      » Channel: ${channel.id}
      » Guild: ${guild ? guild.id : 'Direct Message'}
      `)
        .addField('» Message', message.content)
        .addField('» Error', `\`\`\`${error}\`\`\``)
        .setThumbnail(guild || author);

      this.sendPrivateMessage('ERROR_LOG_CHANNEL', embed);
    } else {
      if (error.notEmbed) canEmbed = false;
      const args = { author, canEmbed, command, prefix, send, t };
      this.sendErrorCommandMessage(t(error.message, error.options), error.onUsage, args);
    }
  }

  sendErrorCommandMessage(errorMessage, onUsage, { send, author, prefix, command, canEmbed, t }) {
    const usage = onUsage && command.usagePath && CommandUtil.getUsage({ command, prefix, t });
    const keyUsage = onUsage && t('errors:usage');

    if (!canEmbed) {
      if (usage) errorMessage += `\n**${keyUsage}**: ${usage}`;
      return send(errorMessage);
    }

    const embed = new SimplicityEmbed(this.client.user, { autoFooter: false, t, type: 'error' })
      .setDescription(errorMessage)
      .setFooter(author);

    if (usage) embed.addField(keyUsage, usage);
    send(embed);
  }
}

module.exports = CommandErrorListener;
