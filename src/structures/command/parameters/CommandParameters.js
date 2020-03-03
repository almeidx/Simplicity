'use strict';

const CommandError = require('../CommandError.js');
const ParameterTypes = require('./types');
const Parameter = require('./types/Parameter.js');

const isNull = (n) => n === null || n === undefined;
const funcOrString = (f, sf, ...args) => typeof f === 'function' ? f(...args) : sf ? sf(f) : f;
const normalizeParam = (options) => {
  const types = options.type.split('|');
  const parameters = [];
  for (const i in types) {
    const entry = types[i];
    const type = ParameterTypes[entry] || entry;
    if (!type || !(type.prototype instanceof Parameter)) throw new TypeError('Invalid parameter type');
    options = { ...type.parseOptions(i), ...options };
    parameters.push(type);
  }
  const result = { ...options, moreParams: parameters.length > 1, types: parameters };
  return result;
};

class CommandParameters {
  static parseOptions(params = []) {
    const length = params.length;
    const hasFlags = Array.isArray(params[length - 1]);
    return {
      flags: hasFlags ? params[length - 1].map(normalizeParam) : null,
      parameters: (hasFlags ? params.slice(0, length - 1) : params).map(normalizeParam),
    };
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Object} options The options for the parameter.
   * @param {Array<string>} args Array of the command args
   */
  static async handle(context, options, args) {
    const opts = this.parseOptions(options);
    await this.handleFlags(context, opts, args);
    return this.handleArguments(context, opts, args);
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Object} opts The options for the parameter.
   * @param {Array<string>} args Array of the command args
   */
  static async handleFlags(context, opts, args) {
    if (opts.flags) {
      const flagIndex = args.findIndex((a) => a.startsWith('--'));
      if (flagIndex > -1) {
        const [, ...allFlags] = args.splice(flagIndex).join(' ').split('--');
        const flagsObject = {};

        const flagsParsed = allFlags.map((s) => s.trim().split(/[ \t]+/));
        for (let i = 0; i < flagsParsed.length; i++) {
          const [name, ...flagArgs] = flagsParsed[i];
          const flag = opts.flags.find((f) => f.name === name || (f.aliases && f.aliases.includes(name)));
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
   * @param {Object} opts The options for the parameter.
   * @param {Array<string>} args Array of the command args
   */
  static async handleArguments(context, opts, args) {
    const parsedArgs = [];

    const parseState = context.parseState = { argIndex: 0 };
    for (let i = 0; i < opts.parameters.length; i++) {
      const param = opts.parameters[i];

      let arg = args[parseState.argIndex];
      if (
        opts.parameters.length > args.length &&
        !param.required && parseState.argIndex === args.length - 1 &&
        opts.parameters.some((p, pi) => pi > i && p.required)
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
