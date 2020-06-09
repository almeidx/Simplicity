/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TFunction } from 'i18next';
import CommandError from '../CommandError';
import { Arguments, anyArgument } from './types';
import {
  ArgumentFunc, ParameterOptsTypes, CommandParameter, FlagOptions, DefaultFlagOptions,
} from './ArgumentOptions.interfances';
import CommandContext from '../CommandContext';


const isNull = (n: any) => n === null || n === undefined;

const funcOrString = (
  f: ArgumentFunc | string, t: TFunction, wordInvalid: any, ctx: CommandContext,
): Promise<string> | string => {
  if (typeof f === 'function') {
    return f(ctx, wordInvalid);
  }
  return t(f);
};

export default class CommandParameters {
  static normalizeParam(
    opts:
      ParameterOptsTypes |
      ParameterOptsTypes & FlagOptions |
      ParameterOptsTypes & FlagOptions & DefaultFlagOptions,
  ): CommandParameter {
    let options = {};
    const parameters: anyArgument[] = [];
    if (Array.isArray(opts.type)) {
      for (const param of opts.type) {
        parameters.push(Arguments[param]);
        options = Arguments[param].parseOptions(opts);
      }
    } else {
      parameters.push(Arguments[opts.type]);
      options = Arguments[opts.type].parseOptions(opts);
    }
    return {
      ...options,
      parameters,
    } as CommandParameter;
  }

  static async handleFlags(
    context: CommandContext, flags: CommandParameter[],
  ): Promise<Record<string, any>> {
    const flagsObject: Record<string, any> = {};
    const flagIndex = context.args.findIndex((a) => a.startsWith('--'));
    if (flagIndex > -1) {
      const [, ...allFlags] = context.args.splice(flagIndex).join(' ').split('--');

      const flagsParsed = allFlags.map((s) => s.trim().split(/[ \t]+/));
      for (const i in flagsParsed) {
        const [name, ...flagArgs] = flagsParsed[i];
        const flag = flags.find((f) => f.name === name || (f.aliases && f.aliases.includes(name)));
        if (flag) {
          const flagValue = flagArgs.join(' ');

          // eslint-disable-next-line no-await-in-loop
          const parsedFlag = await CommandParameters.parseParameter(context, flag, flagValue);
          if (parsedFlag && flag.isDefaultFlag) {
            return flag.handle;
          }

          flagsObject[flag.name] = parsedFlag;
        }
      }
    }
    return flagsObject;
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Object[]} args Array of the command args
   */
  static async handleArguments(context: CommandContext, args: CommandParameter[]): Promise<any[]> {
    const parsedArgs: any[] = [];

    const parseState = { argIndex: 0 };
    for (const i in args) {
      const param = args[i];

      let arg = context.args[parseState.argIndex];
      if (
        args.length > context.args.length
        && param.optional && parseState.argIndex === args.length - 1
        && args.some((p, pi) => pi > Number(i) && !p.optional)
      ) {
        parsedArgs.push(undefined);
      } else {
        if (param.entireQuery) {
          arg = context.args.slice(parseState.argIndex).join(param.matchJoin);
        }
        const parsedArg = await CommandParameters.parseParameter(context, param, arg);
        parsedArgs.push(parsedArg);
        parseState.argIndex += 1;
      }
    }

    return parsedArgs;
  }

  static async parseParameter(
    context: CommandContext, param: CommandParameter, query: string,
  ): Promise<any> {
    const result = await CommandParameters.runParameter(param, query, context);
    if (isNull(result) && !param.optional) {
      const missingErr = await CommandParameters.getErrorTraslation(param, query, context);
      throw new CommandError(missingErr, { showUsage: param.showUsage });
    }

    if (!isNull(result)) {
      if (param.whitelist) {
        const whitelisted = param.whitelist.length > 0 && param.whitelist.includes(result);
        if (!whitelisted) {
          const missingErr = await CommandParameters.getErrorTraslation(param, query, context);
          throw new CommandError(missingErr, { showUsage: param.showUsage });
        }
      }
    }

    return result;
  }

  static getErrorTraslation(
    arg: CommandParameter, wordInvalid: any, context: CommandContext,
  ): Promise<string> | string {
    return funcOrString(arg.missingError, context.t, wordInvalid, context);
  }

  // eslint-disable-next-line consistent-return
  static async runParameter(
    param: CommandParameter, query: string, context: CommandContext,
  ): Promise<any> {
    for (const parameter of param.parameters) {
      // eslint-disable-next-line no-await-in-loop
      const result = await parameter.handle(query, param, context);
      if (result) {
        return result;
      }
    }
  }
}
