'use strict';

module.exports = {
  guilds: {
    _id: { type: String, required: true },
    lang: { type: String },
    prefix: { type: String },
    disableChannels: { type: Array },
    autorole: { type: String },
    starboard: { type: String },
    logs: {
      channelID: { type: String },
      memberJoin: { type: Boolean, default: false },
      memberLeave: { type: Boolean, default: false },
    },
  },
};
