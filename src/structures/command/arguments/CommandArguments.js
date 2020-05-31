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

class CommandArguments {
  static parseOptions(argsOrFlags = []) {
    return argsOrFlags.map(normalizeParam);
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Array<Object>} flags Array of the command flags
   */
  static async handleFlags(context, flags) {
    const flagsObject = {};
    const flagIndex = context.args.findIndex((a) => a.startsWith('--'));
    if (flagIndex > -1) {
      const [, ...allFlags] = context.args.splice(flagIndex).join(' ').split('--');

      const flagsParsed = allFlags.map((s) => s.trim().split(/[ \t]+/));
      for (let i in flagsParsed) {
        const [name, ...flagArgs] = flagsParsed[i];
        const flag = flags.find((f) => f.name === name || (f.aliases && f.aliases.includes(name)));
        if (!flag) continue;

        const flagValue = flagArgs.join(' ');

        // eslint-disable-next-line no-await-in-loop
        const parsedFlag = await this.parseParameter(context, flag, flagValue);
        if (parsedFlag && flag.isDefaultFlag) {
          return flag.handle;
        }

        flagsObject[flag.name] = parsedFlag;
      }
    }
    return flagsObject;
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

      if (param.full) arg = context.args.slice(parseState.argIndex).join(param.fullJoin || ' ');
      // eslint-disable-next-line no-await-in-loop
      const parsedArg = await this.parseParameter(context, param, arg);
      parsedArgs.push(parsedArg);
      parseState.argIndex++;
    }
    delete context.parseState;

    return parsedArgs;
  }

  static async parseParameter(context, param, query) {
    const result = await CommandArguments.runParameter(param, query, context);
    if (isNull(result) && param.required) {
      const missingErr = CommandArguments.getErrorTraslation(param, context);
      throw new CommandError(missingErr, param.showUsage);
    }

    if (!isNull(result)) {
      if (param.whitelist) {
        const whitelist = funcOrString(param.whitelist, null, result, context);
        const whitelisted = Array.isArray(whitelist) ? whitelist.includes(result) : !!whitelist;
        if (!whitelisted) {
          const missingErr = CommandArguments.getErrorTraslation(param, context);
          throw new CommandError(missingErr, param.showUsage);
        }
      }
    }

    return result;
  }

  static getErrorTraslation(arg, context) {
    return funcOrString(arg.missingError, context.t, context);
  }

  static async runParameter(param, query, context) {
    for (const parameter of param.types) {
      // eslint-disable-next-line no-await-in-loop
      const result = await parameter._parse(query, param, context);
      if (result) {
        return result;
      }
    }
  }
}

module.exports = CommandArguments;
