'use strict';

const Loader = require('../structures/Loader');

class DatabaseLoader extends Loader {
  constructor(client) {
    super(client, false);
  }

  load() {

  }
}

module.exports = DatabaseLoader;
