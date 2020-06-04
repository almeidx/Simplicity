import SimplicityClient from './discord/SimplicityClient';

/**
 * The main Loader class
 */
export default abstract class Loader {
  client: SimplicityClient;
  required: boolean;

  /**
   * Creates an instance of Loader
   * @param client The Client of the listener
   * @param required Whether the loader is required for the Client to function properly
   */
  constructor(client: SimplicityClient, required = true) {
    this.client = client;
    this.required = required;
  }

  /**
   * Loads the listener
   */
  abstract load(): void;
}
