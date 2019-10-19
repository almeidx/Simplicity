import { Structures } from 'discord.js';
import { Query } from 'mongoose';
import SimplicityClient from '../bot/client/SimplicityClient';
import {
  get, remove, update, create,
} from '../database/collection';
import { GuildData, GuildDocument } from '../database/models/GuildInterface';

export default Structures.extend('Guild', (DiscordGuild) => {
  class SimplicityGuild extends DiscordGuild {
    public readonly client: SimplicityClient

    get data() {
      if (!this.client.databaseConnection) return null;
      return {
        get: () => get(this.id),
        delete: () => remove(this.id),
        update: (data: GuildData = {}) => update(this.id, data),
        create: (data: GuildData = {}) => create(this.id, data),
      };
    }
  }

  return SimplicityGuild;
});

interface data {
    get(): Promise<GuildDocument>,
    delete(): Query<{ ok?: number; n?: number}> & { deleteCount?: number },
    update(data: GuildData): Query<any>,
    create(data: GuildData): Promise<GuildDocument>,
}
declare module 'discord.js' {
    interface Guild {
      client: SimplicityClient;
      data: null | data
    }
}
