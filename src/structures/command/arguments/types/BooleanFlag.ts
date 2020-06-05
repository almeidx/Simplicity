import Argument from './Argument';

export default class BooleanFlag extends Argument<boolean> {
  parse(): true {
    return true;
  }
}
