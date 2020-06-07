import { Structures } from 'discord.js';

Structures.extend('User', (User) => class extends User {
  public isPartial = false;
});

declare module 'discord.js' {
  interface User {
    isPartial: boolean;
  }
}
