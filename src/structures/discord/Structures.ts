import { Structures, Message } from 'discord.js';
import { SimplicityClient } from '..';

Structures.extend('User', (User) => class extends User {
  public isPartial = false;
});

declare module 'discord.js' {
  interface User {
    isPartial: boolean;
  }
  interface Message {
    client: SimplicityClient;
  }
}
