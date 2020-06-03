import LanguagesLoader from './LanguageLoader';
import Loader from '../structures/Loader';
import { SimplicityClient } from '../structures';

export default (client: SimplicityClient): Loader[] => [
  new LanguagesLoader(client),
];
