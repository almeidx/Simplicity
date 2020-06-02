/**
 * Contains various general-purpose utility methods.
 */
class Util {
  /**
   * Checks if a value is empty.
   */
  static isEmpty(val: any): boolean {
    if ([false, null, undefined].includes(val)) return true;
    if (typeof val === 'number') return val === 0;
    if (typeof val === 'boolean') return false;
    if (['function', 'string'].includes(typeof val) || Array.isArray(val)) return val.length === 0;
    if (val instanceof Error) return val.message === '';
    if (val.toString === Object.prototype.toString) {
      const type = val.toString();
      if (['[object File]', '[object Map]', '[object Set]'].includes(type)) return val.size === 0;
      if (type === '[object Object]') return Object.keys(val).length === 0;
    }

    return false;
  }

  /**
   * Makes the text proper cased. Uppercase at beginning of the sentence and lowercase thereafter.
   */
  static capitalize(text: string) {
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Checks if something is a promise.
   */
  static isPromise(val: Promise<any> | any) {
    return val && Object.prototype.toString.call(val) === '[object Promise]' && typeof val.then === 'function';
  }

  /**
   * Slices strings to meet certain length limits.
   */
  static sliceString(str: string, minLength = 0, maxLength = 1024) {
    return str.slice(minLength, maxLength - 3) + (str.length > maxLength - 3 ? '...' : '');
  }

  /**
   * Makes the provided string a code block.
   */
  static code(str: string, lang: string, minLength = 0, maxLength = 1024) {
    return `\`\`\`${lang}\n${Util.sliceString(str, minLength, maxLength)}\n\`\`\``;
  }
}

export default Util;
