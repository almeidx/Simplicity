import BooleanArgument from './BooleanArgument';
import Argument from './Argument';
import { ParameterTypes } from '../ArgumentOptions.interfances';
import BooleanFlag from './BooleanFlag';
import UserArgument from './UserArgument';
import EmojiArgument from './EmojiArgument';

export type anyArgument = Argument<any, any>;

export const Arguments: Record<ParameterTypes, anyArgument> = {
  boolean: new BooleanArgument(),
  booleanFlag: new BooleanFlag(),
  user: new UserArgument(),
  emoji: new EmojiArgument(),
};
export { default as Argument } from './Argument';
