'use strict';

module.exports = {
  boolean: require('./BooleanArgument.js'),
  booleanFlag: require('./BooleanFlagArgument.js'),
  channel: require('./ChannelArgument.js'),
  emoji: require('./EmojiArgument.js'),
  guild: require('./GuildArgument.js'),
  image: require('./ImageArgument.js'),
  member: require('./MemberArgument.js'),
  number: require('./NumberArgument.js'),
  role: require('./RoleArgument.js'),
  string: require('./StringArgument.js'),
  time: require('./TimeArgument.js'),
  url: require('./URLArgument.js'),
  user: require('./UserArgument.js'),
};
