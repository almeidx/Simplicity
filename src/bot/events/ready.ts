import { PresenceData } from 'discord.js';
import SimplicityClient from '../client/SimplicityClient';

export const name = 'ready';
export function handle<SimplicityClient>(): void {
  this.logger.log(
    'Estatísticas:',
    `Logado com ${this.guilds.size} servidores e ${this.users.size} usuários`,
  );

  this.user.setPresence({ activity: { name: `@${this.user.username} help` }, status: 'idle' })
    .then((presence: PresenceData) => this.logger.log('Presence foi definido como:', presence.activity.name))
    .catch((error: Error) => this.logger.error('Não foi possivel setar o Presence', error));
}
