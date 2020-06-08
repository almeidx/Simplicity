import { Util } from 'discord.js';
import CommandError from '../../CommandError';
import Argument from './Argument';
import { StringArgOptions, ParameterOptions } from '../ArgumentOptions.interfances';
import CommandContext from '../../CommandContext';

export default class StringArgument extends Argument<string, StringArgOptions> {
  parseOptions(
    options: StringArgOptions & Partial<ParameterOptions> = {},
  ): Required<StringArgOptions & ParameterOptions> {
    return {
      ...super.parseOptions(options),
      cleanContent: false,
      errorRegex: null,
      missingRegex: 'errors:generic',
      maxLength: 0,
      truncate: false,
      ...options,
    };
  }

  parse(
    opts: Required<StringArgOptions & ParameterOptions>,
    arg: string,
    { t, message }: CommandContext,
  ): string {
    let result = arg;
    if (opts.cleanContent) {
      result = Util.cleanContent(arg, message);
    }

    if (opts.maxLength > 0 && arg.length > opts.maxLength) {
      if (!opts.truncate) {
        throw new CommandError(t('errors:needSmallerString', { number: opts.maxLength }));
      }
      result = result.substring(0, opts.maxLength);
    }

    if (opts.errorRegex && opts.errorRegex.test(result)) {
      throw new CommandError(String(opts.missingRegex));
    }
    return result;
  }
}
