import SimplicityClient from './discord/SimplicityClient';

/**
 * The main Loader class
 */
export default abstract class Loader {
  client: SimplicityClient;
  required: boolean;

  /**
   * @param client The client of the listener
   * @param required If this listener is required
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
