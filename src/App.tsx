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
import GalleryScreen from './screens/GalleryScreen';
import LikesScreen from './screens/LikesScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RootStackParamList} from './types/types';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

function RootStack() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{gestureEnabled: true}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Likes" component={LikesScreen} />
      </Stack.Navigator>
    </QueryClientProvider>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
