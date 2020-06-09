import CommandUtil from '../CommandUtil';
import CommandParameter from './CommandParameter';
import CommandContext from '../CommandContext';
import { CommandParameter as CommandParameterType } from './ArgumentOptions.interfances';

const defaultFlags: CommandParameterType[] = ([
  {
    handle: async (ctx: CommandContext): Promise<void> => {
      const embed = await CommandUtil.getHelpEmbed(ctx);
      ctx.send(embed);
    },
    isDefaultFlag: true,
    name: 'help',
    type: 'booleanFlag',
  },
] as const)
  .map((flag) => CommandParameter.normalizeParam(flag));

export default defaultFlags;
