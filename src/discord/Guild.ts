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

    public prefix: string

    public language: string

    constructor(client: SimplicityClient, data: object) {
      super(client, data);
      this.prefix = process.env.prefix;
      this.language = this.client.defaultLanguage;
    }

    private setDatabase(data: GuildData) {
      if (data.prefix) this.prefix = data.prefix;
      if (data.language) this.language = data.language;
    }

    get data() {
      if (!this.client.databaseConnection) return null;
      return {
        get: () => get(this.id).then((res) => {
          this.setDatabase(res);
          return res;
        }),
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
      data: null | data;
      prefix: string,
      language: string,
    }
}
