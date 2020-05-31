'use strict';

const CommandUtil = require('@util/CommandUtil');
const CommandArgument = require('./arguments/CommandArguments');

const defaultFlags = CommandArgument.parseOptions(
  [
    {
      handle: async (ctx) => {
        const embed = await CommandUtil.getHelp(ctx);
        return ctx.send(embed);
      },
      name: 'help',
      type: 'booleanFlag',
    },
  ],
).map((flag) => {
  flag.isDefaultFlag = true;
  return flag;
});

module.exports = defaultFlags;

