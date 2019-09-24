'use strict';

class Loader {
  constructor(client, required) {
    this.client = client;
    this.required = !!required;
  }

  load() {
    throw new Error(`${this.constructor.name} is incomplete.`);
  }
}

module.exports = Loader;
