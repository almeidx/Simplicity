'use strict';

/**
 * The main Loader class.
 * @class Loader
 */
class Loader {
  /**
   * Creates an instance of Loader.
   * @param {Client} client The Client of the listener.
   * @param {boolean} [required=true] Whether the loader is required for the Client to function properly.
   */
  constructor(client, required = true) {
    this.client = client;
    this.required = !!required;
  }

  /**
   * Loads the listener.
   * @returns {void}
   */
  load() {
    throw new Error(`${this.constructor.name} doesn't have a load() method.`);
  }
}

module.exports = Loader;
