module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['/lib/**/*', 'config/**/*'],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'max-len': [
      1,
      120,
      2,
      {
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
        ignoreUrls: true,
      },
    ],
    curly: 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    'new-cap': 'off',
    'require-jsdoc': 0,
    quotes: ['error', 'single'],
    camelcase: 'off',
    '@typescript-eslint/camelcase': 'off',
    semi: ['error', 'always'],
    'quote-props': ['error', 'as-needed'],
    'object-curly-spacing': ['error', 'always'],
    indent: 'off',
    'operator-linebreak': 'off',
    'brace-style': 'off',
  },
};
