'use strict';

class Loader {
  constructor(client, required) {
    this.client = client;
    this.required = !!required;
  }

  load() {
    throw new Error(`${this.constructor.name} does not have a load() method.`);
  }
}

module.exports = Loader;
