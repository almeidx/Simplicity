import { requireDirectory } from '../../../utils/FileUtils';
import SimplicityClient from '../SimplicityClient';

export const required = true;
export function handle(client: SimplicityClient) {
  requireDirectory('src/bot/events', (error, Event, filename) => {
    if (error) {
      return client.logger.error(`Não foi possivel carregar o evento: ${filename}`, error);
    }

    const { name, handle: eventHandle } = Event;

    client.on(name, eventHandle);
  });
}
