import { MessageTypes } from 'discord.js';
import { ParameterOptions } from '../base';

export default function handleArguments(
  params: ParameterOptions[],
  message: MessageTypes,
) {
  const parameters = message.client.arguments;

  return Promise.all(params.map(async (param) => {
    const parameter = parameters.find((p) => p.name === param.type);
    const validated = await parameter.validate(message, param);
    if (validated === true) {
      const result = await parameter.parse(message, param);
      return result;
    }
  }));
}
