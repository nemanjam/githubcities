/** @type {import('prettier').Config} */
module.exports = {
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  printWidth: 100,
  semi: true,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  endOfLine: 'lf',
  trailingComma: 'es5',
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '',
    '<THIRD_PARTY_MODULES>',
    '',

    // Todo: set up ts aliases for this project

    // frontend
    '^@/app',
    '^@/components/ui',
    '^@/components',
    '^@/hooks',
    '',
    // backend
    '^@/modules/parser',
    '^@/modules',
    '^@/libs',
    '^@/utils',
    '^@/constants',
    '^@/data',
    '^@/config',
    '^[./]', // all relative imports
    '',
    '^@/types',
    '<TYPES>',
    '<TYPES>^[.]',
    '',
    '^@/assets',
    '^@/styles',
  ],
};
