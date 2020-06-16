import Util from '../Util';

describe('Testing isEmpty function', () => {
  it('should return true when the input is 0', () => {
    expect(Util.isEmpty(0)).toBe(true);
  });

  it('should return false when the input is -1', () => {
    expect(Util.isEmpty(-1)).toBe(false);
  });

  it('should return false when the input is 1', () => {
    expect(Util.isEmpty(1)).toBe(false);
  });

  it('should return true when the input is an empty array', () => {
    expect(Util.isEmpty([])).toBe(true);
  });

  it('should return false when the input is an array with one or more elements', () => {
    expect(Util.isEmpty([null])).toBe(false);
    expect(Util.isEmpty([null, 2, 3])).toBe(false);
  });

  it('should return true when the input is an empty object', () => {
    expect(Util.isEmpty({})).toBe(true);
  });

  it('should return false when the input is an object with properties', () => {
    expect(Util.isEmpty({ a: 1 })).toBe(false);
  });

  it('should return true when the input is an empty set', () => {
    expect(Util.isEmpty(new Set())).toBe(true);
  });

  it('should return false when the input is a set with one or more items', () => {
    const set = new Set();
    set.add(1);
    expect(Util.isEmpty(set)).toBe(false);
    set.add(2);
    expect(Util.isEmpty(set)).toBe(false);
  });

  it('should return true when the input is an empty map', () => {
    expect(Util.isEmpty(new Map())).toBe(true);
  });

  it('should return false when the input is a map with one or more items', () => {
    const map = new Map();
    map.set('a', 1);
    expect(Util.isEmpty(map)).toBe(false);
    map.set('b', 2);
    expect(Util.isEmpty(map)).toBe(false);
  });

  it('should return true when the input is an empty string', () => {
    expect(Util.isEmpty('')).toBe(true);
  });

  it('should return false when the input is a non-empty string', () => {
    expect(Util.isEmpty('abc123')).toBe(false);
  });
});

test('if it returns the first letter as a capital letter', () => {
  expect(Util.capitalize('aa')).toBe('Aa');
  expect(Util.capitalize('dsadasfasf')).toBe('Dsadasfasf');
});

test('if it returns false when the input isn\'t a promise', () => {
  expect(Util.isPromise('promise')).toBe(false);
  expect(Util.isPromise({})).toBe(false);
  expect(Util.isPromise([])).toBe(false);
  expect(Util.isPromise(new Set())).toBe(false);
  expect(Util.isPromise(new Map())).toBe(false);
});

test('if it returns true when the input is a promise', () => {
  expect(Util.isPromise(Promise.resolve(null))).toBe(true);
});

test('if it returns a string with "..." at the end when limit is exceeded', () => {
  expect(Util.sliceString('aaaa', 0, 3)).toEqual('...');
  expect(Util.sliceString('aaaa', 0, 2)).toEqual('...');
  expect(Util.sliceString('aaaa', 0, 10)).toEqual('aaaa');
  expect(Util.sliceString('aaaaaaaaa', 0, 7)).toEqual('aaaa...');
});

it('should return the string inside a codeblock', () => {
  expect(Util.code('"string";', 'js')).toEqual('```js\n"string";\n```');
  expect(Util.code('"string";', 'js', 0, 5)).toEqual('```js\n"s...\n```');
});
