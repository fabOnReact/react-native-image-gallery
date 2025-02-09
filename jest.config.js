module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest-setup.js', '@shopify/react-native-skia/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@react-navigation/.*|@tanstack/react-query|@shopify/react-native-skia|react-native-gesture-handler|react-native-reanimated|d3|d3-array|d3-scale|d3-shape)/)',
  ],
};
