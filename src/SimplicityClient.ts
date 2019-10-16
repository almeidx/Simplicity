import { Client, ClientOptions } from 'discord.js';

export default class SimplicityClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
  }
}
