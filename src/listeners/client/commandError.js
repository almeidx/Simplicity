'use strict';

const { CommandError, SimplicityEmbed, SimplicityListener } = require('@structures');

const i18next = require('i18next');
const getTranslation = (dirct, t) => i18next.exists(dirct) && t(dirct);

class CommandErrorListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(_, error, { t, author, prefix, channel, guild, message, canEmbed, send, command }) {
    if (!(error instanceof CommandError)) {
      console.error(error);
      const errorTranslation = error.code && getTranslation(`errors:${error.code}`);
      const errorMessage = errorTranslation || t('api_errors:errorCommand');
      this.sendErrorCommandMessage(errorMessage, false, { send, canEmbed, author, t, command });

      const embed = new SimplicityEmbed(author, { type: 'error' })
        .setDescription(`
      » User: ${author.id}
      » Channel: ${channel.id}
      » Guild: ${guild ? guild.id : 'Direct Message'}
      `)
        .addField('» Message', message.content)
        .addField('» Error', `\`\`\`${error}\`\`\``)
        .setThumbnail(guild || author);

      this.sendPrivateMessage('CHANNEL_LOG_ERROR', embed);
    } else {
      if (error.notEmbed) canEmbed = false;
      const args = { author, command, canEmbed, t, prefix, send };
      this.sendErrorCommandMessage(t(error.message, error.options), error.onUsage, args);
    }
  }

  sendErrorCommandMessage(errorMessage, onUsage, { send, author, prefix, command: { name }, canEmbed, t }) {
    const strUsage = name && `commands:${name}.usage`;
    const usage = onUsage && i18next.exists(strUsage) && `${prefix + name} ${t(strUsage)}`;
    const keyUsage = usage && t('errors:usage');

    if (!canEmbed) {
      if (usage) errorMessage += `\n**${keyUsage}**: ${usage}`;
      return send(errorMessage);
    }

    const embed = new SimplicityEmbed(this.client.user, { type: 'error', autoFooter: false, t })
      .setDescription(errorMessage)
      .setFooter(author);

    if (usage) embed.addField(keyUsage, usage);
    send(embed);
  }
}

module.exports = CommandErrorListener;
