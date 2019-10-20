import { requireDirectory } from '../../../utils/FileUtils';
import SimplicityClient from '../SimplicityClient';

type Instantiable<T = any> = {new(...args: any[]): T};

export const required = true;
export function handle(client: SimplicityClient) {
  requireDirectory('src/bot/commands', ['base'], (error, Command: Instantiable, filename) => {
    if (error) {
      return client.logger.error(`Não foi possivel carregar o comando: ${filename}`, error);
    }

    const command = new Command();
    client.commands.push(command);
  });
}
