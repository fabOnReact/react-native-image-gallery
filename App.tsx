/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={styles.homeScreen}>
      <Text>Home Screen</Text>
    </View>
  );
}

function ImageScreen() {
  return (
    <View>
      <Text>some text</Text>
    </View>
  );
}

function LikesScreen() {
  return (
    <View>
      <Text>some text</Text>
    </View>
  );
}
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Image" component={ImageScreen} />
      <Stack.Screen name="Likes" component={LikesScreen} />
    </Stack.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeScreen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default App;
