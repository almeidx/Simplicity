'use strict';

/* eslint-disable no-unused-vars */

const { inspect } = require('util');
const { Command, CommandError, SimplicityEmbed } = require('@structures');
const { Constants, Util } = require('@util');

const token = process.env.DISCORD_TOKEN;
const { code, isEmpty, isPromise } = Util;

const value = (s) => code(s, 'js').replace(new RegExp(token, 'g'), () => '*'.repeat(token.length));
const hrToSeconds = (hrtime) => (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
const exec = (c) => require('child_process').execSync(c).toString();

/**
 * The Eval command class.
 * @extends Command
 */
class Eval extends Command {
  /**
   * Creates an instance of EvalCommand.
   * @param {Client} client The Client.
   */
  constructor(client) {
    super(client, {
      aliases: ['compile', 'ev', 'evaluate', 'exec', 'execute'],
      category: 'dev',
      name: 'eval',
      requirements: { ownerOnly: true },
    }, [
      {
        full: true,
        missingError: 'You need to input an expression for me to evaluate.',
        required: true,
        type: 'string',
      },
    ]);
  }

  /**
   * What gets ran when the command is called.
   * @param {CommandContext} ctx The context of the command.
   * @param {string} expr The expression to be evaluated.
   * @returns {Promise<Message>} The reply from the command.
   */
  async run(ctx, expr) {
    const {
      args,
      author,
      botLanguages,
      command,
      client,
      channel,
      database,
      emoji,
      guild,
      language,
      member,
      message,
      prefix,
      query,
      send,
      t,
    } = ctx;

    let res;

    const toEval = expr.replace(/(^`{3}(.+)?|`{3}$)/g, '');

    const cleanResult = async (evaluated, hrStart) => {
      const resolved = await Promise.resolve(evaluated);
      const hrDiff = process.hrtime(hrStart);

      const inspected = typeof resolved === 'string' ? resolved : inspect(resolved, { depth: 0, showHidden: true });
      const cleanEvaluated = value(this.clean(inspected));

      const executedIn = `Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms`;
      return `${isPromise(evaluated) ? 'Promise ' : ''}Result (${executedIn}): ${cleanEvaluated}`;
    };

    try {
      const hrStart = process.hrtime();
      const evaluated = eval(expr);
      res = await cleanResult(evaluated, hrStart);
    } catch (err) {
      if (['await is only valid in async function', 'await is not defined'].includes(err.message)) {
        try {
          const hrStart = process.hrtime();
          if (toEval.trim().split('\n').length === 1) {
            res = await cleanResult(eval(`(async () => ${toEval})()`), hrStart);
          } else res = await cleanResult(eval(`(async () => {\n${toEval}\n})()`), hrStart);
        } catch (er) {
          res = `Error: ${value(this.clean(er))}`;
        }
      } else res = `Error: ${value(this.clean(err))}`;
    } finally {
      const msg = await send(res);
      const permissions = channel.permissionsFor(guild.me);

      if (permissions.has('ADD_REACTIONS') && permissions.has('MANAGE_MESSAGES')) {
        await msg.react(emoji('CANCEL', { id: true }));

        const filter = (r, u) => r.me && message.author.id === u.id;
        const collector = await msg.createReactionCollector(filter, { errors: ['time'], max: 1, time: 30000 });

        collector.on('collect', async () => {
          if (!msg.deleted) await msg.delete().catch(() => null);
          if (!message.deleted) await message.delete().catch(() => null);
        });
        collector.on('end', async () => {
          if (!msg.deleted) await msg.reactions.removeAll().catch(() => null);
        });
      }
    }
  }

  /**
   * Cleans blank space from the eval response.
   * @param {*} text The text to clean.
   * @returns {*} The text cleaned.
   * @private
   */
  clean(text) {
    const blankSpace = String.fromCharCode(8203);
    return typeof text === 'string' ? text.replace(/`/g, `\`${blankSpace}`).replace(/@/g, `@${blankSpace}`) : text;
  }
}

module.exports = Eval;
