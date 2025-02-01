module.exports = {
  root: true,
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks', 'react-native', 'import', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'react-native/no-unused-styles': 'warn',
    'react-native/sort-styles': ['error', 'asc', {ignoreClassNames: false}],
    'react-native/no-inline-styles': 'warn',
    'react-native/no-raw-text': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'import/order': ['error', {groups: [['builtin', 'external', 'internal']]}],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
