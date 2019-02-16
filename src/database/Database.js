const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Collection = require('./DBCollection')

class Database {
  constructor (client) {
    this.client = client
    this._guilds = mongoose.model('guilds', new Schema({
      _id: { type: String, required: true },
      lang: { type: String },
      prefix: { type: String },
      channels: [{ id: String, userID: String, date: Date }],
      logs: { channelID: String, logs: [String] },
      blacklist: { type: Boolean }
    }))
    this.guilds = new Collection(this._guilds)
    mongoose.connect(process.env.MLAB_URL, { useNewUrlParser: true })
      .catch(e => console.log(e))
  }
}
module.exports = Database
