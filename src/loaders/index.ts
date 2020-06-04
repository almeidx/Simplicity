import LanguageLoader from './LanguageLoader';
import DatabaseLoader from './DatabaseLoader';

import Loader from '../structures/Loader';
import { SimplicityClient } from '../structures';

export default (client: SimplicityClient): Loader[] => [
  new LanguageLoader(client),
  new DatabaseLoader(client),
];
