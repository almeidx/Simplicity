import { MessageTypes } from 'discord.js';
import CommandError from '../utils/CommandError';


export default function handleError(
  { send, _ }: MessageTypes,
  error: Error,
): Promise<void> {
  if (error instanceof CommandError) {
    return send(_(error.Tkey, error.TOptions || {}));
  }

  return send(_('error:errorCommand'));
}
