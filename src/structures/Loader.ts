import { Client } from 'discord.js';

/**
 * The main Loader class.
 * @class Loader
 */
export default abstract class Loader {
  client: Client;
  required: boolean;

  /**
   * Creates an instance of Loader.
   * @param client The Client of the listener.
   * @param required Whether the loader is required for the Client to function properly.
   */
  constructor(client: Client, required = true) {
    this.client = client;
    this.required = required;
  }

  /**
   * Loads the listener.
   */
  abstract load(): void;
}
