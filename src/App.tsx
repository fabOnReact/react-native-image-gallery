/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './screens/HomeScreen';
import ImageScreen from './screens/ImageScreen';
import LikesScreen from './screens/LikesScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RootStackParamList} from './types/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

function RootStack() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Image" component={ImageScreen} />
        <Stack.Screen name="Likes" component={LikesScreen} />
      </Stack.Navigator>
    </QueryClientProvider>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

export default App;
