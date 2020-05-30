'use strict';

const CommandError = require('../CommandError.js');
const ArgumentType = require('./types');
const Argument = require('./types/Argument.js');

const isNull = (n) => n === null || n === undefined;
const funcOrString = (f, sf, ...args) => typeof f === 'function' ? f(...args) : sf ? sf(f) : f;
const normalizeParam = (options) => {
  const types = options.type.split('|');
  const parameters = [];
  for (const i in types) {
    const entry = types[i];
    const type = ArgumentType[entry] || entry;
    if (!type || !(type.prototype instanceof Argument)) throw new TypeError('Invalid parameter type');
    options = { ...type.parseOptions(i), ...options };
    parameters.push(type);
  }
  const result = { ...options, moreParams: parameters.length > 1, types: parameters };
  return result;
};

class CommandParameters {
  static parseOptions(argsOrFlags = []) {
    return argsOrFlags.map(normalizeParam);
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Object} flags Array of the command flags
   * @param {Object} args Array of the command args
   */
  static async handle(context, flags, args) {
    await this.handleFlags(context, flags);
    return this.handleArguments(context, args);
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Array<Object>} flags Array of the command flags
   */
  static async handleFlags(context, flags) {
    if (flags) {
      const flagIndex = context.args.findIndex((a) => a.startsWith('--'));
      if (flagIndex > -1) {
        const [, ...allFlags] = context.args.splice(flagIndex).join(' ').split('--');
        const flagsObject = {};

        const flagsParsed = allFlags.map((s) => s.trim().split(/[ \t]+/));
        for (let i in flagsParsed) {
          const [name, ...flagArgs] = flagsParsed[i];
          const flag = flags.find((f) => f.name === name || (f.aliases && f.aliases.includes(name)));
          if (!flag) return;

          const flagValue = flagArgs.join(' ');
          const missingErr = funcOrString(flag.missingError, context.t, context);
          // eslint-disable-next-line no-await-in-loop
          const parsedFlag = await this.parseParameter(context, flag, flagValue, missingErr);
          flagsObject[flag.name] = parsedFlag;
        }
        context.flags = flagsObject;
      }
    }
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Object[]} args Array of the command args
   */
  static async handleArguments(context, args) {
    const parsedArgs = [];

    const parseState = context.parseState = { argIndex: 0 };
    for (let i in args) {
      const param = args[i];

      let arg = context.args[parseState.argIndex];
      if (
        args.length > context.args.length &&
        !param.required && parseState.argIndex === args.length - 1 &&
        args.some((p, pi) => pi > i && p.required)
      ) {
        parsedArgs.push(undefined);
        continue;
      }

      if (param.full) arg = args.slice(parseState.argIndex).join(param.fullJoin || ' ');

      // eslint-disable-next-line no-await-in-loop
      const parsedArg = await this.parseParameter(
        context, param, arg, funcOrString(param.missingError, context.t, context),
      );
      parsedArgs.push(parsedArg);
      parseState.argIndex++;
    }
    delete context.parseState;

    return parsedArgs;
  }

  static async parseParameter(context, param, arg, missingErr) {
    let parsedArg;
    for (const parameter of param.types) {
      // eslint-disable-next-line no-await-in-loop
      const result = await parameter._parse(arg, param, context);
      if (result) {
        parsedArg = result;
        break;
      }
    }

    if (isNull(parsedArg) && param.required) {
      throw new CommandError(missingErr, param.showUsage);
    }

    if (!isNull(parsedArg)) {
      if (param.whitelist) {
        const whitelist = funcOrString(param.whitelist, null, parsedArg, context);
        const whitelisted = Array.isArray(whitelist) ? whitelist.includes(parsedArg) : !!whitelist;
        if (!whitelisted) {
          throw new CommandError(missingErr, param.showUsage);
        }
      }
    }

    return parsedArg;
  }
}

module.exports = CommandParameters;
