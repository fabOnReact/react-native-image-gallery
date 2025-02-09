import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import GalleryScreen from './screens/GalleryScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RootStackParamList} from './types/types';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Provider} from 'jotai';
import {Button, StyleSheet} from 'react-native';

// Suppress logs in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: true,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('Favorites')}
              title="★"
              color="#000"
            />
          ),
        })}
      />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
    </Stack.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.safeArea}>
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;
