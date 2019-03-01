module.exports = {
  'guilds': {
    _id: { type: String, required: true },
    lang: { type: String },
    prefix: { type: String },
    channels: [{ id: String, userID: String, date: Date }],
    logs: { channelID: String, logs: [String] },
    blacklist: { type: Boolean }
  }
}
