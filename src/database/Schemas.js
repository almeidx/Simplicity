'use strict';

module.exports = {
  guilds: {
    _id: { required: true, type: String },
    autorole: { default: false, type: String },
    disableChannels: { type: Array },
    lang: { default: process.env.DEFAULT_LANG, type: String },
    logs: {
      GuildMemberAdd: { default: null, type: String },
      GuildMemberRemove: { default: null, type: String },
      GuildUpdates: { default: null, type: String },
      MessageUpdate: { default: null, type: String },
      UserUpdate: { default: null, type: String },
      VoiceChannelLogs: { default: null, type: String },
    },
    prefix: { default: process.env.PREFIX, type: String },
    starboard: { default: null, type: String },
  },
};
