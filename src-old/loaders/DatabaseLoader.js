'use strict';

const Database = require('../database/Database');
const Loader = require('../structures/Loader');

class DatabaseLoader extends Loader {
  constructor(client) {
    super(client, false);
  }

  async load() {
    try {
      const database = await Database.connect();
      this.client.database = database;
    } catch (error) {
      console.error(error);
      this.client.database = null;
    }
    return this.client.databaseLoaded;
  }
}

module.exports = DatabaseLoader;
