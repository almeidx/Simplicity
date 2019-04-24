module.exports = {
  'guilds': {
    _id: { type: String, required: true },
    lang: { type: String },
    prefix: { type: String },
    logs: {
      GuildMemberAdd: { type: String, default: null }
    }
  }
}
