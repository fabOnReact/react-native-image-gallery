module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest-setup.js', '@shopify/react-native-skia/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@react-navigation/.*|@tanstack/react-query|@shopify/react-native-skia|react-native-gesture-handler|react-native-reanimated|d3|d3-array|d3-scale|d3-shape)/)',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Ensure Babel handles transformations
  },
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js', // Map d3 to its compiled version
    '^@components/(.*)$': '<rootDir>/src/components/$1', // Ensure Jest resolves @components alias
  },
};
