import LanguageLoader from './LanguageLoader';
import DatabaseLoader from './DatabaseLoader';
import ListenerLoader from './ListenerLoader';
import CommandLoader from './CommandLoader';

import { SimplicityClient, Loader } from '../structures';

export default (client: SimplicityClient): (Loader)[] => [
  new LanguageLoader(client),
  new DatabaseLoader(client),
  new ListenerLoader(client),
  new CommandLoader(client),
];
