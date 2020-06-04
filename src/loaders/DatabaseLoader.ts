
import { Loader } from '../structures';
import * as database from '../database';
import SimplicityClient from '../structures/discord/SimplicityClient';
import Logger from '../util/Logger';

export default class DatabaseLoader extends Loader {
  constructor(client: SimplicityClient) {
    super(client, false);
  }

  async load(): Promise<boolean> {
    try {
      await database.connection();
      this.client.database = database;
      return true;
    } catch (error) {
      Logger.error(error);
    }
    return false;
  }
}
