'use strict';

module.exports = {
  guilds: {
    _id: { type: String, required: true },
    lang: { type: String },
    prefix: { type: String },
    disableChannels: { type: Array },
    starboard: { type: String },
    logs: {
      GuildMemberAdd: { type: String, default: null },
      GuildMemberRemove: { type: String, default: null },
      GuildUpdates: { type: String, default: null },
      MessageUpdate: { type: String, default: null },
      UserUpdate: { type: String, default: null },
      VoiceChannelLogs: { type: String, default: null },
    },
  },
};
