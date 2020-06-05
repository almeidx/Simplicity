import BooleanArgument from './BooleanArgument';
import Argument from './Argument';
import { ParameterTypes } from '../ArgumentOptions.interfances';
import BooleanFlag from './BooleanFlag';

export type anyArgument = Argument<any, any>;

export const Arguments: Record<ParameterTypes, anyArgument> = {
  boolean: new BooleanArgument(),
  booleanFlag: new BooleanFlag(),
};
export { default as Argument } from './Argument';
