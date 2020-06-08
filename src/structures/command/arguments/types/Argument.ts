import { ParameterOptions } from '../ArgumentOptions.interfances';
import CommandContext from '../../CommandContext';

export default abstract class Argument<Result, Options = ParameterOptions> {
  parseOptions(
    options: Partial<Options & ParameterOptions> = {},
  ): Required<ParameterOptions> {
    return {
      aliases: [],
      entireQuery: false,
      matchJoin: ' ',
      missingError: 'errors:generic',
      name: '',
      optional: true,
      showUsage: true,
      whitelist: [],
      ...options,
    };
  }

  handle(
    arg: string, options: Required<Options & ParameterOptions>, ctx: CommandContext,
  ): Result | void | null | Promise<Result | void | null> {
    return this.parse(options, arg, ctx);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract parse(
    opts: Required<Options & ParameterOptions>, arg: string, ctx: CommandContext
  ): Result | void | null | Promise<Result | void | null>;
}
