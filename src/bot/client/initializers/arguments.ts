import { requireDirectory } from '../../../utils/FileUtils';
import SimplicityClient from '../SimplicityClient';

type Instantiable<T = any> = {new(...args: any[]): T};

export const required = true;
export function handle(client: SimplicityClient) {
  requireDirectory('src/bot/commands/base/arguments', ['base'], (error, Parameter: Instantiable, filename) => {
    if (error) {
      return client.logger.error(`Não foi possivel carregar o parametro: ${filename}`, error);
    }

    const command = new Parameter();
    client.arguments.push(command);
  });
}
