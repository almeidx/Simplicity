const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Collection = require('./DBCollection')
const Schemas = require('./Schemas')

class Database {
  constructor () {
    for (const x in Schemas) {
      const schema = new Schema(Schemas[x])
      const model = mongoose.model(x, schema)
      this[x] = new Collection(model)
    }
    mongoose.connect(process.env.MLAB_URL, { useNewUrlParser: true }).catch(e => console.error(e))
  }
}

module.exports = Database
