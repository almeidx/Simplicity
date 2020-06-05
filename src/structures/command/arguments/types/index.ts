import BooleanArgument from './BooleanArgument';
import Argument from './Argument';
import { ParameterTypes } from '../ArgumentOptions.interfances';

export type anyArgument = Argument<any, any>;

export const Arguments: Record<ParameterTypes, anyArgument> = {
  boolean: new BooleanArgument(),
};
export { default as Argument } from './Argument';
