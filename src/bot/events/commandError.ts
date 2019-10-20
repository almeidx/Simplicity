import { Message } from 'discord.js';
import SimplicityClient from '../client/SimplicityClient';
import { CommandBaseError } from '../commands/base/utils/CommndError';

type errorTypes = Error | CommandBaseError

export const name = 'commandError';
export async function handle<SimplicityClient>(
  { send, _ }: Message,
  error: errorTypes,
): Promise<void> {
  if (error instanceof CommandBaseError) {
    return send(_(error.response));
  }

  return send(_('error:errorCommand'));
}
