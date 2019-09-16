'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Collection = require('./DBCollection');
const Schemas = require('./Schemas');

class Database {
  static async connect() {
    const database = {};
    for (const x in Schemas) {
      const schema = new Schema(Schemas[x]);
      const model = mongoose.model(x, schema);
      database[x] = new Collection(model);
    }
    await mongoose.connect(process.env.MLAB_URL, { useNewUrlParser: true });
    return database;
  }
}

module.exports = Database;
