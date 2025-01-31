/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={styles.homeScreen}>
      <Text>Home Screen</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App(): React.JSX.Element {
  return <Navigation />;
}

const styles = StyleSheet.create({
  homeScreen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default App;
