import React, { useEffect } from 'react';
import { Asset } from 'expo-asset';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';

import Loading from './pages/Loading';
import SignUp from './pages/SignUp'
import Login from './pages/Login';
import Form from './pages/Form';
import Settings from './pages/Settings';
import PasswordReset from './pages/PasswordReset';


const Stack = createStackNavigator();

function App() {
  async function cacheImages() {
    const loadingImage = Asset.fromModule(require('./assets/wbl-logo.png')).downloadAsync();

    await Promise.all([loadingImage])
  }
  
  useEffect(() => {
    cacheImages();
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen name='Loading' component={Loading} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="PasswordReset" component={PasswordReset} />
        <Stack.Screen name='Form' component={Form} options={{ title: 'Add stats' }} />
        <Stack.Screen name='Settings' component={Settings} />
      </Stack.Navigator>
      <FlashMessage position="center" />
    </NavigationContainer>
  );
}

export default App;

