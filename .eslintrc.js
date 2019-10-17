module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "no-unused-vars": "off",
    "import/prefer-default-export": "off",
    "no-useless-return": "off",
    "consistent-return": "off",
    "no-extra-semi": "off"
  },
};
