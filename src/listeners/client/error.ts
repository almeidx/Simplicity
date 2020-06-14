import { Embed, Listener } from '../../structures';
import SimplicityClient from '../../structures/discord/SimplicityClient';
import { Logger, Util } from '../../util';

export default class ErrorListener extends Listener {
  constructor(client: SimplicityClient) {
    super('error', client);
  }

  exec(error: Error): void {
    Logger.error(`[Error]\n${error.stack}`);

    Util.perString(String(error.stack), (stack, i) => {
      this.sendPrivateMessage('ERROR_LOG',
        new Embed()
          .setError()
          .setTitle(`PAGE ${i + 1}`)
          .setDescription(Util.code(stack, 'js', 0, 2000)));
    }, 2048);
  }
}
