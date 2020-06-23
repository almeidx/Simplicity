import BooleanArgument from './BooleanArgument';
import Argument from './Argument';
import { ParameterTypes } from '../ArgumentOptions.interfances';
import BooleanFlag from './BooleanFlag';
import UserArgument from './UserArgument';
import EmojiArgument from './EmojiArgument';
import StringArgument from './StringArgument';
import RoleArgument from './RoleArgument';

export type anyArgument = Argument<any, any>;

export const Arguments: Record<ParameterTypes, anyArgument> = {
  boolean: new BooleanArgument(),
  booleanFlag: new BooleanFlag(),
  user: new UserArgument(),
  emoji: new EmojiArgument(),
  string: new StringArgument(),
  role: new RoleArgument(),
};
export { default as Argument } from './Argument';
