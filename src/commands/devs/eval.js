'use strict';

/* eslint-disable no-unused-vars */
const { Command, CommandError, SimplicityEmbed, Utils: { code } } = require('../../');
const { inspect } = require('util');
const token = process.env.DISCORD_TOKEN;
const value = (s) => code(s, 'js').replace(token, () => '*'.repeat(token.length));

class Eval extends Command {
  constructor(client) {
    super(client, {
      aliases: ['compile', 'ev', 'evaluate'],
      category: 'dev',
      requirements: {
        ownerOnly: true,
        argsRequired: true,
      },
    });
  }

  async run(ctx) {
    const { args, author, botLanguages, channel, client, command, database, emoji, guild, language, member, message,
      prefix, query, send, t } = ctx;
    const embed = new SimplicityEmbed({ author });
    const text = query.replace(/^```(js|javascript ?\n)?|```$/gi, '');

    try {
      const evald = await Promise.resolve(eval(text));
      const fixed = inspect(evald, { depth: 0, showHidden: true });

      embed
        .setDescription(value(fixed))
        .setColor('GREEN');

      if (!fixed || !evald) embed.setColor('RED');
    } catch (error) {
      embed
        .setDescription(value(error))
        .setColor('RED');
      console.error(['COMMAND', 'EVAL-RESULT'], error);
    } finally {
      const msg = await send(embed);
      const permissions = channel.permissionsFor(guild.me);

      if (permissions.has('ADD_REACTION') && permissions.has('MANAGE_MESSAGES')) {
        await msg.react(emoji('CANCEL', { id: true }));

        const filter = (r, u) => r.me && message.author.id === u.id;
        const collector = await msg.createReactionCollector(filter, { max: 1, errors: ['time'], time: 30000 });

        collector.on('collect', async () => {
          if (msg) await msg.delete().catch(() => null);
          if (message) await message.delete().catch(() => null);
        });
        collector.on('end', async () => {
          if (msg) await msg.reactions.removeAll().catch(() => null);
        });
      }
    }
  }
}

module.exports = Eval;
