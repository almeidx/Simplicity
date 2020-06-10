/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-unused-vars */

import { inspect } from 'util';
import { execSync } from 'child_process';
import {
  Command, CommandError, SimplicityEmbed, SimplicityClient, CommandContext,
} from '../../structures';
import { Constants, Util } from '../../util';

const token = String(process.env.DISCORD_TOKEN);
const { code, isEmpty } = Util;

const value = (str: string) => code(str, 'js')
  .replace(new RegExp(token, 'g'), () => '*'.repeat(token.length));
const exec = (str: string) => execSync(str).toString();

/**
 * The Eval command class.
 * @extends Command
 */
export default class Eval extends Command {
  /**
   * Creates an instance of EvalCommand.
   * @param {Client} client The Client.
   */
  constructor(client: SimplicityClient) {
    super(client, 'eval', {
      aliases: ['compile', 'ev', 'evaluate', 'exec', 'execute'],
      args: [
        {
          entireQuery: true,
          missingError: 'You need to input an expression for me to evaluate.',
          optional: false,
          type: 'string' as const,
        },
      ],
      category: 'dev',
      requirements: { ownerOnly: true },
    });
  }

  /**
   * What gets ran when the command is called.
   * @param {CommandContext} ctx The context of the command.
   * @param {string} expr The expression to be evaluated.
   * @returns {Promise<Message>} The reply from the command.
   */
  async run(ctx: CommandContext, expr: string): Promise<void> {
    const {
      args,
      author,
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
      send,
      t,
    } = ctx;

    let res = 'null';
    const toEval = expr.replace(/(^`{3}(\w+)?|`{3}$)/g, '');

    try {
      const hrStart = process.hrtime();
      const evaluated = eval(toEval);
      res = await Eval.cleanResult(evaluated, hrStart);
    } catch (err) {
      if (Eval.isPromiseError(err)) {
        try {
          const hrStart = process.hrtime();
          if (toEval.trim().split('\n').length === 1) {
            res = await Eval.cleanResult(eval(`(async () => ${toEval})()`), hrStart);
          } else res = await Eval.cleanResult(eval(`(async () => {\n${toEval}\n})()`), hrStart);
        } catch (er) {
          res = `Error: ${value(Eval.clean(er.stack))}`;
        }
      } else res = `Error: ${value(Eval.clean(err.stack))}`;
    } finally {
      const msg = await send(res);
      const permissions = channel.permissionsFor(String(guild.me?.id));

      if (permissions && permissions.has(['ADD_REACTIONS', 'MANAGE_MESSAGES'])) {
        await msg.react(emoji(true, 'CANCEL'));

        const collector = await msg.createReactionCollector(
          (r, u) => r.me && message.author.id === u.id, { max: 1, time: 30000 },
        );

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
   * @param {string} text The text to clean.
   * @returns {string} The text cleaned.
   * @private
   */
  static clean(text: string): string {
    const blankSpace = String.fromCharCode(8203);
    return text
      .replace(/`/g, `\`${blankSpace}`)
      .replace(/@/g, `@${blankSpace}`);
  }

  static inspect(resolved: any): string {
    return typeof resolved === 'string' ? resolved : inspect(resolved, { depth: 0, showHidden: true });
  }

  static async cleanResult(evaluated: string, hrStart: [number, number]): Promise<string> {
    const resolved = await Promise.resolve(evaluated);
    const hrDiff = process.hrtime(hrStart);
    const inspected = Eval.inspect(resolved);
    const cleanEvaluated = value(Eval.clean(inspected));

    const executedIn = `Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms`;
    return `${Util.isPromise(evaluated) ? 'Promise ' : ''}Result (${executedIn}): ${cleanEvaluated}`;
  };

  static isPromiseError(error: Error): boolean {
    return ['await is only valid in async function', 'await is not defined'].includes(error.message);
  }
}
