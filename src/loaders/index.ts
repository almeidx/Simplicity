import LanguageLoader from './LanguageLoader';
import DatabaseLoader from './DatabaseLoader';
import ListenerLoader from './ListenerLoader';

import { SimplicityClient, Loader } from '../structures';

export default (client: SimplicityClient): (Loader)[] => [
  new LanguageLoader(client),
  new DatabaseLoader(client),
  new ListenerLoader(client),
];
