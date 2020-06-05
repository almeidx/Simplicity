
import CommandError from '../../CommandError';
import Argument from './Argument';
import { BooleanArgOptions, ParameterOptions } from '../ArgumentOptions.interfances';
import CommandContext from '../../CommandContext';

export default class BooleanArgument extends Argument<boolean, BooleanArgOptions> {
  parseOptions(
    options: Partial<BooleanArgOptions & ParameterOptions> = {},
  ) : BooleanArgOptions & ParameterOptions {
    return {
      ...super.parseOptions(options),
      falseValues: options.falseValues || ['false', 'no', 'off'],
      trueValues: options.trueValues || ['true', 'yes', 'on'],
    };
  }

  parse(opts: BooleanArgOptions, arg: string, { t }: CommandContext): boolean {
    if (!opts.trueValues.concat(opts.falseValues).includes(arg)) throw new CommandError(t('errors:notTrueOrFalse'));
    return opts.trueValues.includes(arg);
  }
}
