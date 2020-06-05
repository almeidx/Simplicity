import { ParameterOptions } from '../ArgumentOptions.interfances';
import CommandContext from '../../CommandContext';

export default abstract class Argument<Result, Options = ParameterOptions> {
  parseOptions(
    options: Partial<Options & ParameterOptions> = {},
  ): ParameterOptions {
    return {
      aliases: options.aliases || [],
      entireQuery: !!options.entireQuery,
      matchJoin: options.matchJoin || ' ',
      missingError: options.missingError || 'errors:generic',
      name: options.name ?? '',
      optional: !!options.optional,
      showUsage: options.showUsage ?? true,
      whitelist: options.whitelist || [],
    };
  }

  handle(
    arg: string, options: Options & ParameterOptions, ctx: CommandContext,
  ): Result | void | null {
    return this.parse(options, arg, ctx);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract parse(
    opts: Options & ParameterOptions, arg: string, ctx: CommandContext
  ): Result | void | null;
}
