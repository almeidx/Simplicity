'use strict';

const { SimplicityEmbed, SimplicityListener, CommandError } = require('../..');

class CommandErrorListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  on(client, error, { t, author, prefix, channel, guild, message, send }) {
    if (!(error instanceof CommandError)) {
      console.error(error);
      const channelError = process.env.CHANNEL_LOG_ERROR && client.channels.get(process.env.CHANNEL_LOG_ERROR);
      if (channelError) {
        const infos = [
          `» User: ${author.toString()} *[${author.id}]*`,
          `» Channel: ${channel.type === 'dm' ? 'DM' : `*${channel.toString()} [${channel.id}]`}*`,
          `» Guild: ${guild ? `${guild.name} [${guild.id}]` : 'DM'}`,
          `» Message: ${message.content} *[${message.id}]*`,
        ];
        const embedError = new SimplicityEmbed(null, { type: 'error' })
          .addField('» Info', `**${infos.join('\n')}**`)
          .addField('» Error', `**» ID: ${error.message}\n\`\`\`js\n${error.stack}\n\`\`\`**`);
        channelError.send(embedError);
        const embed = new SimplicityEmbed({ t, author }, { type: 'error' })
          .setDescription(t('errors:errorCommand'))
          .setText('@description');
        return send(embed);
      }
    }

    const embed = new SimplicityEmbed({ author, t })
      .setError()
      .setDescription(t(error.message, error.options));

    const strUsage = `commands:${this.name}.usage`;
    const usage = error.onUsage && client.i18next.exists(strUsage) && t(strUsage);

    if (usage) embed.addField('errors:usage', `${prefix + this.name} ${usage}`);

    if (error.fields && error.fields.length > 0) for (const i in error.fields) {
      const field = error.fields[i];
      embed.addField(field.name, field.value, field.inline, field.options, field.valueOptions);
    }

    let fields = '';
    if (embed.fields.length > 0) for (const i in embed.fields) fields += `\`@fields.${i}.name \` @fields.${i}.value \n`;

    embed.setText(`@description ${fields}`);
    return send(embed);
  }
}

module.exports = CommandErrorListener;
